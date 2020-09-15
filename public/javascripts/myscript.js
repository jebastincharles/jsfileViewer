$(document).ready(function(){
 renderPage($('#filename').val(),null, 1, false);
 $(document).on("dblclick", ".cropper-container", function(e) {
    var canvas =  $('#rdr-image').cropper('getCroppedCanvas');;
    var canvaURL = canvas.toDataURL('image/jpeg');
    var image = document.createElement("IMG");
    image.setAttribute("src", canvaURL);
    $('#cropdiv').append(image);
    $('#rdr-image').cropper('destroy');
  });
  $(document).on("click", "img[id^=rdr-image_]", function(e) {
    var id = $(this).attr('id');
    var matches = id.match(/\d+/g);
    renderPage(null,null,matches[0], true);
  });
  $(document).on("keypress", "input[id^=currentpage]", function(e) {
    if (event.keyCode == 13 || event.which == 13){
          var currPage = $("#currentpage").val();
           renderPage($('#filename').val(),null, currPage, false);
    }
  });



  $('#display-thumbnail').scroll(function() {
    var display_thumbnail = $("#display-thumbnail");
    if(display_thumbnail.is(":visible")) {
    //  display_thumbnail.hide();
    }
    var obj = document.getElementById('display-thumbnail');
    console.log(obj.scrollHeight)
    console.log(obj.scrollTop)
    console.log(obj.clientHeight)
    console.log('......')
    var rdrPage = 1;
    if (obj.clientHeight + obj.scrollTop >=  obj.scrollHeight)
    {
      var idOf = $( "div[id^=display-thumbnail] img:last-child" ).attr('id');
      rdrPage = idOf.match(/\d+/g)[0];
      var lastPage =  $("#totalpages").html();
      if (rdrPage == lastPage) {
        console.log('reached last');
        return;
      }
      renderThumbNailOnScroll(null,null, rdrPage);
    }// else if (obj.scrollTop == 0) {
    //  var idOf = $( "div[id^=display-thumbnail] img:first-child" ).attr('id');
      //rdrPage = idOf.match(/\d+/g)[0];
    //}

  });
  $('body').bind('DOMNodeInserted' , function(event) {
    if(event.target && $(event.target).attr('class') == 'zoomLens'){
      var zoomx = parseFloat($('#zoomx').val());
      var zoomy = parseFloat($('#zoomy').val());
      var imgAngle = (parseInt($('#imgAngle').val()) );
      var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)"
      $('.zoomLens').css('transform', value);
     }
   });

});

var zoomto100 = function(){

    var imgOut = $('#rdr-image');
    var imgdiv = $('#display-image');
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



/*$.fn.myElevateZoom = function () {
  $('.zoomContainer').remove();
 $(this).elevateZoom({

           zoomType: "lens",
        lensShape: "round",
        containLensZoom: true,
        scrollZoom: true,
        lensSize: 200,
        easing: true
       });


}; */

var zoomlens = function() {
  if ($('.zoomContainer').length > 0) {
    $('.zoomContainer').remove();
    return;
  }

  $('#rdr-image').elevateZoom({
          zoomType: "lens",
         lensShape: "round",
         containLensZoom: true,
         scrollZoom: true,
         lensSize: 200,
         easing: true
        });




}

var crop = function() {
  if($('#rdr-image').hasClass('cropper-hidden') ){
    $('#rdr-image').cropper('destroy');
      return;
  } /*else if($('.cropper-container').length) {
    $('.cropper-container').show();
    $('#rdr-image').addClass('cropper-hidden');
    return;
  } */

  const image = document.getElementById('rdr-image');
  const cropper = $('#rdr-image').cropper( {
    modal: true,
    dragMode: 'crop',
    aspectRatio: 2 / 1,
    format:"png",
    //autoCropArea: 0.65,
    restore: true,
    guides: false,
    center: false,
    highlight: true,
    rotatable:true,
    background: false,
    scalable : true,
    cropBoxMovable: true,
    cropBoxResizable: true,
    toggleDragModeOnDblclick: false,
    zoom: function(e) {
    },
    crop(event) {
      console.log(JSON.stringify(event.detail));
      event.preventDefault();
    },
    ready: function() {
      var zoomx = parseFloat($('#zoomx').val());
      var zoomy = parseFloat($('#zoomy').val());
      var imgAngle = (parseInt($('#imgAngle').val()) );
       this.cropper.scale(zoomx, zoomy).rotate(360);
    }
  });
}


var fittoheight = function(){
  var imgdiv = $('#display-image');
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
  var imgOut = $('#rdr-image');
  var zoomx = 1;
  var zoomy = parseFloat($('#zoomy').val());
  var imgAngle = (parseInt($('#imgAngle').val()) )% 360;
  var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
  imgOut.css({transform: value});
  $('#zoomx').val(zoomx);
  imgOut.width(imgdiv.innerWidth() + "px");
  imgdiv.css('overflow-x','hidden');

}

var fittopage = function(){
  var imgdiv = $('#display-image');

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

  var imgOut = $('#rdr-image');
  var imgdiv = $('#display-image');

  var zoomx = parseFloat($('#zoomx').val())-.1;
  var zoomy = parseFloat($('#zoomy').val())-.1;
  var imgAngle = (parseInt($('#imgAngle').val()) )% 360;
  var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
  imgOut.css({transform: value});
  if (zoomx != 1 || zoomy != 1) {
    if(imgAngle == 0) {
      imgOut.css({'transform-origin': 'top left'});
    } else  {
      //imgOut.css({'transform-origin': 'top left'});
      imgOut.css({'transform-origin': '50% 50%'});
    }
  }
  $('#zoomx').val(zoomx);
  $('#zoomy').val(zoomy);
  imgdiv.css('overflow', 'scroll');

}

var getCorodinates = function(object, coordinateName) {

  var imgOut = object;
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
//  alert(matrix)
  //alert('translate_val..'+translate_val)
  var matrixVal = translate_val.toString().split(',');
  //alert(matrixVal)
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
  var filename = $('#filename').val();
  window.location="/tiff/download?file="+filename;
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
  var imgdiv = $('#display-image');
  var zoomx = parseFloat($('#zoomx').val())+.1;
  var zoomy = parseFloat($('#zoomy').val())+.1;
  var imgAngle = (parseInt($('#imgAngle').val()) )% 360;
  //imgOut.addClass('rt-transform');
//  transform: scaleX(1.5) scaleY(1.5) rotate(0deg);
  var value = "scaleX("+zoomx+") scaleY("+zoomy+") rotate("+imgAngle+"deg)";
  //alert(value)
  imgOut.css({transform: value});
  if (zoomx != 1 || zoomy != 1) {
    if(imgAngle == 0) {
      imgOut.css({'transform-origin': 'top left'});
    } else  {
      //imgOut.css({'transform-origin': 'top left'});
      imgOut.css({'transform-origin': '50% 50%'});
    }
  }
  $('#zoomx').val(zoomx);
  $('#zoomy').val(zoomy);
  imgdiv.css('overflow', 'scroll');
}

var renderPage = function (filename, event, page, showThumbnail) {
  var file = !!filename ? filename : $('#filename').val();
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
  var data = {
    page: pagVal,
    filename: file
  };
  var url= '/'+findServicePath(file)+'/render?page='+pagVal+"&random="+Math.random()
  $.post(url, data, function(data) {
      //console.log("data.."+data.totalPages +"-"+data.currentpage);
      $("#display-image").html(data.data);
      $("#totalpages").html(data.totalPages);
      $("#currentpage").val(data.currentpage);
      $("#refCurrentPage").val(data.currentpage);
    //  $("#filename").val(data.filename);
      if(showThumbnail) {
        $("#display-thumbnail").show();
      } else {
        $("display-thumbnail").hide();
      }
  });
};
var uploadFile =  function() {
let photo = document.getElementById("fileLoad").files[0];
let req = new XMLHttpRequest();
let formData = new FormData();

formData.append("photo", photo);
req.open("POST", '/upload/image');
req.send(formData);
req.onreadystatechange = function() {
    if (req.readyState === 4) {
      var data = JSON.parse(req.response);
    //  console.log("data.."+JSON.stringify(data));
        console.log("data.filename.."+JSON.stringify(data.filename));
        $("#filename").val(data.filename);
        $("#display-thumbnail").css('display', 'none');
      renderPage(data.filename, null, 1, false);
      //callback(xhr.response);
    }
  }



}

var findServicePath = function(filename) {
  var ext = filename.split('.').pop().toLowerCase();
  //alert(ext)
  var path;
    switch(ext) {
        //if .jpg/.gif/.png do something
        case 'jpg':
        case 'jpeg':
            path = "jpeg";
            break;
        case 'gif':
        case 'png':
            path = "png";
            break;
        case 'tiff':
        case 'tif':
            path = "tiff";
            break;
        case 'pdf':
            path = "pdf";
            break;
    }
    //alert(path)
  return path;
}

var renderThumbNail = function (filename, event, page) {
  var file = !!filename ? filename : $('#filename').val();
  var display_thumbnail = $("#display-thumbnail");
  if(display_thumbnail.is(":visible")) {
    display_thumbnail.hide();
    return;
  }
  var pagVal = page;
  var currPage = !!page ? page : $("#refCurrentPage").val();
  var lastPage =  $("#totalpages").html();
  console.log('rendering thumbanil..'+pagVal);
  var   url= '/'+findServicePath(file)+'/rendernail?random='+Math.random();
  var data= {
    page: currPage,
    url: file,
    totalpages: lastPage
  };
  $.post(url, data,function(data) {
      var images = data.images;
      var display_thumbnail = $("#display-thumbnail");
      display_thumbnail.html(images);
      display_thumbnail.show();
  });
};


var renderThumbNailOnScroll = function (filename, event, page) {
  var file = !!filename ? filename : $('#filename').val();

  var pagVal = page;
  var currPage = !!page ? page : $("#refCurrentPage").val();
  var lastPage =  $("#totalpages").html();
  console.log('rendering thumbanil..'+currPage);

  var   url= '/'+findServicePath(file)+'/rendernail?random='+Math.random();
  var data= {
    page: currPage,
    url: file,
    totalpages: lastPage
  };
  $.post(url, data,function(data) {
      var images = data.images;
      var display_thumbnail = $("#display-thumbnail");
       $( "div[id^=display-thumbnail] img:last-child" ).remove();
      display_thumbnail.append(images);
      display_thumbnail.show();
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
      imgOut.css({'transform-origin': ''});
      //var value = "rotate("+imgAngle+"deg)";
      //imgOut.css({'transform-origin': ''});
      imgOut.css({transform: value});
      if (zoomx != 1 || zoomy != 1) {
        if(imgAngle == 0) {
          imgOut.css({'transform-origin': 'top left'});
        } else  {
          //imgOut.css({'transform-origin': 'top left'});
          imgOut.css({'transform-origin': '50% 50%'});
        }
    }
      //imgOut.css({'transform-origin': 'center'});
      $('#imgAngle').val(imgAngle);
    }
