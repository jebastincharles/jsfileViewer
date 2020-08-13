//$(function() {


$(document).ready(function(){
 renderPage(1);
  /*$("#button").on("click", renderPage(1));
  $("#first-img").on("click", renderPage(1));
  $("#previous-img").on("click", renderPage(1));
  $("#next-img").on("click", renderPage(1));
  $("#last-img").on("click", renderPage(1));
  $("#currentpage").onEnter(renderPage(2)); */
});

var draw = function(scale, translatePos, canvas){
    //var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");
  var imgOut = document.getElementById('tiffPage');
    // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

	context.save();
	context.translate(translatePos.x, translatePos.y);
	context.scale(scale, scale);

	context.drawImage(imgOut, 0, 0, imgOut.width,    imgOut.height,     // source rectangle
                   0, 0, canvas.width, canvas.height); // destination rectangle;
	context.restore();

  imgOut.src = canvas.toDataURL();
}

var zoom = function(){
  var imgOut = document.getElementById('tiffPage');
  //imgOut.style.width = (imgOut.width + 100) + "px";

//return;
	var  canvas = document.createElement("canvas");
  	var ctx=canvas.getContext("2d");
    var imgOut = document.getElementById('tiffPage');
       //var canvas = document.getElementById("myCanvas");

    //I add at the canvas width and height dimensions based on window outer boundaries
    //canvas.width=window.outerWidth;
    //canvas.height=window.outerHeight;

    canvas.width=1200;
    canvas.height=800;
    //canvas.width=imgOut.width;
    //canvas.height=imgOut.height;
    ///////////////////////////////////

    //To center the img I divide the x and y 22 factor
    var translatePos = {
        x: canvas.width/22,
        y: canvas.height/22
    };
    //////////////////////////////////////////////////////
    var scale = 1.0;
    var scaleMultiplier = 0.92;
    var startDragOffset = {};
    var mouseDown = false;


     scale /= scaleMultiplier;
    draw(scale, translatePos, canvas);
};

//});

var renderPage = function (event, page) {
  var pagVal = 0;
  var currPage = $('#currentpage').html();
  var lastPage =  $('#totalpages').html();
  //alert('currPage..'+currPage);
  if ('first' == event) {
    pagVal = 1;
  } else if('next' == event) {
      pagVal  = currPage + 1;
  }else if('prev' == event) {
    pagVal  = currPage - 1;
  } else if('last' == event) {
    pagVal = lastPage;
  }
  $.ajax({
    type: 'GET',
    url: '/tiff/tt?page='+page+"&random="+Math.random(),
    success: function(data) {
      console.log("data.."+data)
      $('#mydiv').html(data.data);
      $('#totalpages').html(data.totalPages);
      $('#currentpage').html(data.currentpage);
      $("input[id=refCurrentPage]").html(data.currentpage);
    //  $('#refCurrentPage')
    //  alert($('#refCurrentPage').val());
    },
    error: function(error) {
      console.log(error)
    }
  });
};

/*var rotateImg = function ()
    {
            var imgOut = document.getElementById('tiffPage');
              let canvas = document.createElement("canvas");
              let ctx = canvas.getContext("2d");
              let scale = 1;
              canvas.width = imgOut.height * scale;
              canvas.height= imgOut.width * scale;
              ctx.translate(canvas.width, 0);
              ctx.rotate(90 * Math.PI / 180);
              ctx.drawImage(imgOut, 0, 0, canvas.height, canvas.width);
              imgOut.src = canvas.toDataURL();
        } */
//var angleInDegrees = 0;
    var drawRotated = function (degrees){
              var imgOut = document.getElementById('tiffPage');

            /*  if(angleInDegrees == 0)
                  degrees = 270;
              else
                  degrees -=90 % 360; */

                //  degrees = 90;


            canvas = document.createElement("canvas");
            var ctx=canvas.getContext("2d");
            canvas.style.width="20%";

            if(degrees == 90 || degrees == 270) {
                canvas.width = imgOut.height;
                canvas.height = imgOut.width;
            } else {
                canvas.width = imgOut.width;
                canvas.height = imgOut.height;
            }

            ctx.clearRect(0,0,canvas.width,canvas.height);
            if(degrees == 90 || degrees == 270) {
                ctx.translate(imgOut.height/2,imgOut.width/2);
            } else {
                ctx.translate(imgOut.width/2,imgOut.height/2);
           }
            ctx.rotate(degrees*Math.PI/180);
            ctx.drawImage(imgOut,-imgOut.width/2,-imgOut.height/2);
              imgOut.src = canvas.toDataURL();
        }
