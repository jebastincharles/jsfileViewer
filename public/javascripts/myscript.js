$(document).ready(function(){
 renderPage(null, 1, false);
 $(document).on("dblclick", ".cropper-container", function(e) {
    var canvas =  $('#rdr-image').cropper('getCroppedCanvas');;
    var canvaURL = canvas.toDataURL('image/jpeg');
    var image = document.createElement("IMG");
    image.setAttribute("src", canvaURL);
    $('#cropdiv').append(image);
     $('.cropper-container').hide();
     $('#rdr-image').removeClass('cropper-hidden')
  });
});

var zoomto100 = function(){
    /*var imgdiv = $('#display-image');
    var imgOut = $('#rdr-image');
    imgdiv.css('overflow','scroll');
    var scale = 'scale(1.5)';
    imgOut.css('transform', scale); */


    var imgOut = $('#rdr-image');
    var zoomx = 1.5;
    var zoomy = 1.5;
    var imgAngle = (parseInt($('#imgAngle').val()) )% 360;
    var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
    imgOut.css({transform: value});
    $('#zoomx').val(zoomx);
    $('#zoomy').val(zoomy);
    imgdiv.css('overflow', 'scroll');
}

var invertColorImage = function() {
    if($('#rdr-image').hasClass("invertcss")) {
        $('#rdr-image').removeClass("invertcss");
    } else {
        $('#rdr-image').addClass("invertcss")
    }
}

var addBrightness = function() {
    if($('#rdr-image').hasClass("brightnesscss")) {
        $('#rdr-image').removeClass("brightnesscss");
    } else {
        $('#rdr-image').addClass("brightnesscss")
          $('#rdr-image').css('--brightness', '70%');
    }
}

var addContrast = function() {
    if($('#rdr-image').hasClass("contrastcss")) {
        $('#rdr-image').removeClass("contrastcss");
    } else {
        $('#rdr-image').addClass("contrastcss")
        $('#rdr-image').css('--contrast', '60%');
    }
}

var zoomBand = function() {
  /*  let cropperImg = $('#rdr-image').data('cropper');
    if(cropperImg) {
       $('#rdr-image').cropper('zoom', 0.1);
    } */

    $('#rdr-image').ezPlus({
        responsive: true,
        zoomLens: false,
        zoomType: 'window',
        lensShape: 'square',
        scrollZoom: true,
        lensSize: 100,
        zoomWindowWidth: 500,
        zoomWindowHeight: 200
    });
}

var zoomlens = function() {
  var disable = false;
  if($('.zoomContainer').length) {
    let action='hide';
    let plugin = $('#rdr-image').data('ezPlus');
    //alert(plugin)
    if (plugin) {
        plugin.showHideZoomContainer(action);
        plugin.showHideWindow(action);
        plugin.showHideTint(action);
        plugin.showHideLens(action);
        plugin.destroy();
    }
    return;
  }
    $('#rdr-image').ezPlus({
        zoomLens: false,
        zoomType: 'lens',
        lensShape: 'square',
        lensSize: 100,
        zoomWindowHeight: 200,
        zoomWindowWidth: 200,
        borderSize: 1,
        easing: true
    });
}

var crop = function() {
  if($('#rdr-image').hasClass('cropper-hidden') ){
    $('.cropper-container').hide();
    $('#rdr-image').removeClass('cropper-hidden')
      return;
  } else if($('.cropper-container').length) {
    $('.cropper-container').show();
    $('#rdr-image').addClass('cropper-hidden');
    return;
  }

  const image = document.getElementById('rdr-image');
  const cropper = $('#rdr-image').cropper( {
    modal: true,
    dragMode: 'crop',
    aspectRatio: 2 / 1,
    format:"png",
    //autoCropArea: 0.65,
    restore: false,
    guides: false,
    center: false,
    highlight: true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
    zoom: function(e) {
    },
    crop(event) {
      console.log(JSON.stringify(event.detail));
      event.preventDefault();
    }
  });
}


var fittoheight = function(){
  var imgdiv = $('#display-image');
/*  var imgOut = $('#rdr-image');
  var scalex = getCorodinates('rdr-image', 'scaleX');
  var scale = 'scale('+scalex+',1)';
  imgOut.css('transform', scale); */


  var imgOut = $('#rdr-image');
  var zoomx = parseFloat($('#zoomx').val());
  var zoomy = 1;
  var imgAngle = (parseInt($('#imgAngle').val()) )% 360;
  var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
  imgOut.css({transform: value});
  $('#zoomy').val(zoomy);
  imgOut.height(imgdiv.innerHeight() + "px");
  imgdiv.css('overflow-y','hidden');
}

var fittowidth = function(){
  var imgdiv = $('#display-image');

/*  var imgOut = $('#rdr-image');
  var scaley = getCorodinates('rdr-image', 'scaleY');
  var scale = 'scale(1,'+ scaley+')';
  imgOut.css('transform', scale); */


  var imgOut = $('#rdr-image');
  var zoomx = 1;
  var zoomy = parseFloat($('#zoomy').val());
  var imgAngle = (parseInt($('#imgAngle').val()) )% 360;
  var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
  imgOut.css({transform: value});
  $('#zoomx').val(zoomx);
  imgOut.width(imgdiv.innerWidth() + "px");
  imgdiv.css('overflow-x','hidden');

/*  var imgOut = $('#rdr-image');
  var imgdiv = $('#display-image');
  var scale = 'scaleX(1)';
  imgOut.css('transform', scale);
  imgOut.width(imgdiv.innerWidth() + "px"); */
}

var fittopage = function(){
  var imgdiv = $('#display-image');


  /*var imgOut = $('#rdr-image');

  var scale = 'scale(1,1)';
  imgOut.css('transform', scale); */

  var imgOut = $('#rdr-image');
  var zoomx = 1;
  var zoomy = 1;
  var imgAngle = (parseInt($('#imgAngle').val()) )% 360;
  var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
  imgOut.css({transform: value});
  $('#zoomx').val(zoomx);
  $('#zoomy').val(zoomy);

  imgOut.width(imgdiv.innerWidth() + "px");
  imgOut.height(imgdiv.innerHeight() + "px");
  imgdiv.css('overflow','hidden');
}

var zoomin = function(){
  /*var imgOut = $('#rdr-image');
  var scalex = getCorodinates('rdr-image', 'scaleX');
  var scaley = getCorodinates('rdr-image', 'scaleY');
  var scalexNewVal = scalex > 0 ? scalex-0.1 :  0;
  var scaleyNewVal = scaley > 0 ? scaley-0.1 :  0;
  var scale = 'scale('+scalexNewVal+','+ scaleyNewVal+')';
  imgOut.css('transform', scale); */

  var imgOut = $('#rdr-image');
  var zoomx = parseFloat($('#zoomx').val())-.1;
  var zoomy = parseFloat($('#zoomy').val())-.1;
  var imgAngle = (parseInt($('#imgAngle').val()) )% 360;
  var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
  imgOut.css({transform: value});
  $('#zoomx').val(zoomx);
  $('#zoomy').val(zoomy);


}

var getCorodinates = function(elementName, coordinateName) {

  var imgOut = $('#'+elementName);
  var matrix = imgOut.css('transform');
  //alert('translate_val..'+(matrix == 'none'));
  if (matrix == 'none') {
    if (coordinateName == 'scaleX') return 1;
    if (coordinateName == 'skewY') return 0;
    if (coordinateName == 'skewX') return 0;
    if (coordinateName == 'scaleY') return 1;
    if (coordinateName == 'translateX') return 0;
    if (coordinateName == 'translateY') return 0;

  }
  var translate_val = matrix.match(/-?[\d\.]+/g);
  //alert('translate_val..'+translate_val)
  var matrixVal = translate_val.toString().split(',');
  if (matrixVal.length >= 6 ) {
    if (coordinateName == 'scaleX') return matrixVal[0];
    if (coordinateName == 'skewY') return matrixVal[1];
    if (coordinateName == 'skewX') return matrixVal[2];
    if (coordinateName == 'scaleY') return matrixVal[3];
    if (coordinateName == 'translateX') return matrixVal[4];
    if (coordinateName == 'translateY') return matrixVal[5];
  }
  return '';

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
  var imgOut = $('#rdr-image');
  var zoomx = parseFloat($('#zoomx').val())+.1;
  var zoomy = parseFloat($('#zoomy').val())+.1;
  var imgAngle = (parseInt($('#imgAngle').val()) )% 360;
  //imgOut.addClass('rt-transform');
//  transform: scaleX(1.5) scaleY(1.5) rotate(0deg);
  var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
  //alert(value)
  imgOut.css({transform: value});
  $('#zoomx').val(zoomx);
  $('#zoomy').val(zoomy);
}

var renderPage = function (event, page, showThumbnail) {
  var pagVal = page;
  var currPage = $("#refCurrentPage").val();
  var lastPage =  $("#totalpages").html();
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
    url: '/pdf/render?page='+pagVal+"&random="+Math.random(),
    success: function(data) {
      console.log("data.."+data.totalPages +"-"+data.currentpage);
      $("#display-image").html(data.data);
      $("#totalpages").html(data.totalPages);
      $("#currentpage").val(data.currentpage);
      $("#refCurrentPage").val(data.currentpage);
      if(showThumbnail) {
        $("#display-thumbnail").show();
      } else {
        $("display-thumbnail").hide();
      }
    },
    error: function(error) {
      console.log(error)
    }
  });
};

var renderPage1 = function (event, page, showThumbnail) {
  var pagVal = page;
  var currPage = $("#refCurrentPage").val();
  var lastPage =  $("#totalpages").html();
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
    url: '/pdf/render?page='+pagVal+"&random="+Math.random(),
    success: function(data) {
      console.log("data.."+data.totalPages +"-"+data.currentpage);
      $("#display-image").html(data.data);
      $("#totalpages").html(data.totalPages);
      $("#currentpage").val(data.currentpage);
      $("#refCurrentPage").val(data.currentpage);
      if(showThumbnail) {
        $("#display-thumbnail").show();
      } else {
        $("display-thumbnail").hide();
      }
    },
    error: function(error) {
      console.log(error)
    }
  });
};

var renderThumbNail = function (event, page) {
  var display_thumbnail = $("#display-thumbnail");
  if(display_thumbnail.is(":visible")) {
    display_thumbnail.hide();
    return;
  }
  var pagVal = page;
  var currPage = $("#refCurrentPage").val();
  var lastPage =  $("#totalpages").html();
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
    url: '/jpeg/rendernail?page='+pagVal+"&random="+Math.random(),
    success: function(data) {
      var images = data.images;
      var display_thumbnail = $("#display-thumbnail");
      display_thumbnail.html(images);
      display_thumbnail.show();
    },
    error: function(error) {
      console.log(error)
    }
  });
};

    var drawRotated = function (degrees){

      /*var scalex = getCorodinates('rdr-image', 'scaleX');
      var scaley = getCorodinates('rdr-image', 'scaleY');
      var scale = 'scale('+scalex+','+ scaley+')';
      var imgAngle = (parseInt($('#imgAngle').val()) + degrees)% 360;
      $('#rdr-image').css('transform', 'rotate('+imgAngle+'deg)');
      $('#imgAngle').val(imgAngle);*/

      var imgOut = $('#rdr-image');
      var zoomx = parseFloat($('#zoomx').val());
      var zoomy = parseFloat($('#zoomy').val());
      var imgAngle = (parseInt($('#imgAngle').val()) + degrees)% 360;
      var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
      imgOut.css({transform: value});
      $('#imgAngle').val(imgAngle);
    }
