$(document).ready(function(){
 renderPage(null, 1, false);
 $(document).on("dblclick", ".cropper-container", function(e) {
    var canvas =  $('#tiffPage').cropper('getCroppedCanvas');;
    var canvaURL = canvas.toDataURL('image/jpeg');
    console.log(canvaURL);
    var image = document.createElement("IMG");
    image.setAttribute("src", canvaURL);
    $('#cropdiv').append(image);
     //$('#cropdiv').html(canvas);
     $('.cropper-container').hide();
     $('#tiffPage').removeClass('cropper-hidden')
  });

});

var zoomto100 = function(){
    var imgOut = document.getElementById('tiffPage');
    var imgdiv = document.getElementById('mydiv');
    imgdiv.style.overflow = 'scroll';
    var scale = 'scale(1.5)';
    imgOut.style.transform = scale;
    imgdiv.style.overflow = scroll;
}

var invertColorImage = function() {
    if($('#tiffPage').hasClass("invertcss")) {
        $('#tiffPage').removeClass("invertcss");
    } else {
        $('#tiffPage').addClass("invertcss")
    }
}

var addBrightness = function() {
    if($('#tiffPage').hasClass("brightnesscss")) {
        $('#tiffPage').removeClass("brightnesscss");
    } else {
        $('#tiffPage').addClass("brightnesscss")
          $('#tiffPage').css('--brightness', '70%');
    }
}

var addContrast = function() {
    if($('#tiffPage').hasClass("contrastcss")) {
        $('#tiffPage').removeClass("contrastcss");
    } else {
        $('#tiffPage').addClass("contrastcss")
        $('#tiffPage').css('--contrast', '60%');
    }
}

var zoomlens = function() {
  var disable = false;

  if($('.zoomContainer').length) {
    let action='hide';
    let plugin = $('#tiffPage').data('ezPlus');
    alert(plugin)
    if (plugin) {
        plugin.showHideZoomContainer(action);
        plugin.showHideWindow(action);
        plugin.showHideTint(action);
        plugin.showHideLens(action);
        plugin.destroy();
    }
    return;
  }
    $('#tiffPage').ezPlus({
        zoomLens: false,
        zoomType: 'lens',
        lensShape: 'round',
        lensSize: 100
    });



}

var crop = function() {
  if($('#tiffPage').hasClass('cropper-hidden') ){
    $('.cropper-container').hide();
    $('#tiffPage').removeClass('cropper-hidden')

      return;
  } else if($('.cropper-container').length) {
    $('.cropper-container').show();
    $('#tiffPage').addClass('cropper-hidden');
    return;
  }

  const image = document.getElementById('tiffPage');
  const cropper = $('#tiffPage').cropper( {
    modal: true,
    dragMode: 'crop',
    aspectRatio: 2 / 1,
    //autoCropArea: 0.65,
    restore: false,
    guides: false,
    center: false,
    highlight: false,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
    crop(event) {

    //  const cropBoxData = cropper.getCropBoxData();
console.log(JSON.stringify(event.detail));
      console.log(event.detail.x);
      console.log(event.detail.y);
      console.log(event.detail.width);
      console.log(event.detail.height);
      console.log(event.detail.rotate);
      console.log(event.detail.scaleX);
      console.log(event.detail.scaleY);
    //  console.log('url..'+cropper.getCroppedCanvas());
    //  $('#thumbnaildiv').append(cropper.getCroppedCanvas())  ;

      //alert(cropBoxData)
      event.preventDefault();
    },
  });




const image1 = $('#tiffPage');


}

var zoomLens = function(){
    var imgOut = document.getElementById('tiffPage');
    var imgdiv = document.getElementById('mydiv');
    imgdiv.style.overflow = 'scroll';
    var scale = 'scale(1.5)';
    imgOut.style.transform = scale;
    imgdiv.style.overflow = scroll;
}

var fittoheight = function(){
  var imgOut = document.getElementById('tiffPage');
  var imgdiv = document.getElementById('mydiv');
  var scale = 'scaleY(1)';
  imgOut.style.transform = scale;
  imgOut.style.height = imgdiv.clientHeight + "px";
}

var fittowidth = function(){
  var imgOut = document.getElementById('tiffPage');
  var imgdiv = document.getElementById('mydiv');
  var scale = 'scaleX(1)';
  imgOut.style.transform = scale;
  imgOut.style.width = imgdiv.clientWidth + "px";
}

var fittopage = function(){
  var imgOut = document.getElementById('tiffPage');
  var imgdiv = document.getElementById('mydiv');
  var scale = 'scale(1,1)';
  imgOut.style.transform = scale;
  imgOut.style.width = imgdiv.clientWidth + "px";
  imgOut.style.height = imgdiv.clientHeight + "px";
  imgdiv.style.overflow = 'hidden';
}



var zoomin = function(){
  var imgOut = document.getElementById('tiffPage');
  //var scale = 'scale(0.9)';
//  alert(imgOut.style.transform)
//  imgOut.style.transform = scale;
  imgOut.style.width = (imgOut.width - 25) + "px";
  imgOut.style.height = (imgOut.height - 25) + "px";
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
  imgOut.style.height = (imgOut.height + 25) + "px";
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
      document.getElementById('tiffPage').style.transform  = "rotate("+imgAngle+"deg)";
      document.getElementById('imgAngle').value = imgAngle;
      return;
    }
