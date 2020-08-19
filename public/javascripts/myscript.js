$(document).ready(function(){
 renderPage(null, 1, false);
});

var zoomin = function(){
  var imgOut = document.getElementById('tiffPage');
  imgOut.style.width = (imgOut.width - 25) + "px";
}

var download = function(){
  window.location="/tiff/download";
}

var print = function(){
  var myWindow=window.open();
   myWindow.document.write($('#mydiv').html());
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

var renderPage = function (event, page, showThumbnail) {
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
      document.getElementById("mydiv").innerHTML = data.data;
      document.getElementById("totalpages").innerHTML = data.totalPages;
      document.getElementById("currentpage").value = data.currentpage;
      document.getElementById("refCurrentPage").value = data.currentpage;
      if(showThumbnail) {
        document.getElementById("thumbnaildiv").style.display = 'block';
      } else {
        document.getElementById("thumbnaildiv").style.display = 'none';
      }
    },
    error: function(error) {
      console.log(error)
    }
  });
};

var renderThumbNail = function (event, page) {
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
    url: '/tiff/rendernail?page='+pagVal+"&random="+Math.random(),
    success: function(data) {
      var images = data.images;
      var thumbNailDiv = document.getElementById("thumbnaildiv");
      thumbNailDiv.innerHTML = images;
      thumbNailDiv.style.display = 'block';
    },
    error: function(error) {
      console.log(error)
    }
  });
};

    var drawRotated = function (degrees){
      var imgAngle = (parseInt(document.getElementById('imgAngle').value) + degrees)% 360;
      document.getElementById('tiffPage').style.transform = "rotate("+imgAngle+"deg)";
      document.getElementById('imgAngle').value = imgAngle;
      return;
    }
