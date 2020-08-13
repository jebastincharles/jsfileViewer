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

//});

var renderPage = function (event, page) {
  var pagVal = 0;
  var currPage = $('#currentpage').html();
  var lastPage =  $('#totalpages').html();
  alert('currPage..'+currPage);
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
              alert(angleInDegrees)
            /*  if(angleInDegrees == 0)
                  degrees = 270;
              else
                  degrees -=90 % 360; */

                //  degrees = 90;

                  angleInDegrees = degrees;
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
