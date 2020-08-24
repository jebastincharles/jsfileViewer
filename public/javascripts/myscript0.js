//$(function() {


$(document).ready(function(){
 renderPage(null, 1);
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

var zoomin = function(){
  var imgOut = document.getElementById('tiffPage');
  imgOut.style.width = (imgOut.width - 25) + "px";
}

var download = function(){
  window.location="/tiff/download";
}

var print = function(){
  var myWindow=window.open();
   myWindow.document.write($('#display-image').html());
   myWindow.document.close();
   myWindow.focus();
   myWindow.print();
   myWindow.close();
}

var zoomout = function(){
  var imgOut = document.getElementById('tiffPage');
  var containerWidth = $(".container").width();
  if (containerWidth < (imgOut.width + 25)) {
    imgOut.style.overflow = 'scroll';
  }
  imgOut.style.width = (imgOut.width + 25) + "px";
}

var zoom = function(){
  var imgOut = document.getElementById('tiffPage');
  imgOut.style.width = (imgOut.width + 50) + "px";
return;
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
    canvas.width=imgOut.width;
    canvas.height=imgOut.height;
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
  var pagVal = page;
  var currPage = document.getElementById("refCurrentPage").value;
  var lastPage =  document.getElementById("totalpages").innerHTML;
  if ('first' == event) {
    pagVal = 1;
  } else if('next' == event) {
      pagVal  = parseInt(currPage) + 1;
  }else if('prev' == event) {
    pagVal  = parseInt(currPage) - 1;
  } else if('last' == event) {
    pagVal = lastPage;
  }
  console.log('rendering page..'+pagVal);
  $.ajax({
    type: 'GET',
    url: '/tiff/render?page='+pagVal+"&random="+Math.random(),
    success: function(data) {
      console.log("data.."+data.totalPages +"-"+data.currentpage);
      document.getElementById("display-image").innerHTML = data.data;
      document.getElementById("totalpages").innerHTML = data.totalPages;
      document.getElementById("currentpage").value = data.currentpage;
      document.getElementById("refCurrentPage").value = data.currentpage;
    /*  $('#display-image').html(data.data);
      $('#totalpages').html(data.totalPages);
      $('#currentpage').html(data.currentpage);
      $("input[id=refCurrentPage]").html(data.currentpage); */

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
