$(document).ready(function(){
 //renderPage($('#filename').val(),null, 1, false);
 renderPage("C:\\Users\\jebastin\\Desktop\\files\\multiSample.tif",null, 1, false);


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

    var obj = document.getElementById('display-thumbnail');
    var rdrPage = 1;
    if (obj.clientHeight + obj.scrollTop >=  obj.scrollHeight)
    {
      var idOf = $( "div[id^=display-thumbnail] img:last-child").attr('id');
      rdrPage = idOf.match(/\d+/g)[0];
      var lastPage =  $("#totalpages").html();
      if (rdrPage == lastPage) {
        return;
      }

      renderThumbNailOnScroll(null,null, rdrPage);
    }

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
var pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
const zoomto100 = () => {
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
  if (matrix == 'none') {
    if (coordinateName == 'scaleX') return 1;
    if (coordinateName == 'skewY') return 0;
    if (coordinateName == 'skewX') return 0;
    if (coordinateName == 'scaleY') return 1;
    if (coordinateName == 'translateX') return 0;
    if (coordinateName == 'translateY') return 0;

  }
  var translate_val = matrix.match(/-?[\d\.]+/g);
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
  var filename = $('#filename').val();
  url= findServicePath(filename)+"/download?filename="+filename+"&random="+Math.random();
  window.location=url;
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
  var data = {
    page: pagVal,
    filename: file
  };
  var url= findServicePath(file)+'?page='+pagVal+"&random="+Math.random()
  if(url.indexOf('pdf') >= 0 ) {
      renderPDF(url, data, showThumbnail)
      return
  }
  $.ajax({
    url: url,
    type: "POST",
    beforeSend: function(request) {
      request.setRequestHeader("content-type", 'application/json');
    },
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data) {
      dataval = "data:image/png;base64,"+data.data.substring(2, data.data.length-1);
      var imaageCreated = '<img id="rdr-image" src="'+dataval+'" />';
      $("#display-image").html(imaageCreated);
      $("#totalpages").html(data.total_pages);
      $("#currentpage").val(data.page);
      $("#refCurrentPage").val(data.page);
      if(showThumbnail) {
        $("#display-thumbnail").show();
      } else {
        $("display-thumbnail").hide();
      }
  }
});
}
 const  decodeBase64 = function(data) {
   return data.toString('base64')
  // return atob(data)
  //return Buffer.from(data, "base64").toString("base64");

}
var uploadFile =  function() {
let photo = document.getElementById("fileLoad").files[0];
let req = new XMLHttpRequest();
let formData = new FormData();

formData.append("photo", photo);
req.open("POST", "/upload/image");
req.send(formData);
req.onreadystatechange = function() {
    if (req.readyState === 4) {
      var data = JSON.parse(req.response);
        console.log("data.filename.."+JSON.stringify(data.filename));
        $("#filename").val(data.filename);
        $("#display-thumbnail").css('display', 'none');
      renderPage(data.filename, null, 1, false);
    }
  }



}

var findServicePath = function(filename) {
  var ext = filename.split('.').pop().toLowerCase();
  var path;
    switch(ext) {
        //if .jpg/.gif/.png do something
        case 'jpg':
        case 'jpeg':
            path = "http://localhost:8000/img/jpg/";
            break;
        case 'gif':
            path = "http://localhost:8000/img/gif/";
            break;
        case 'png':
            path = "http://localhost:8000/img/png/";
            break;
        case 'tiff':
        case 'tif':
            path = "http://localhost:8000/img/tif/";
            break;
        case 'pdf':
            path = "http://localhost:8000/document/pdf/";
            break;
    }
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
  var   url= findServicePath(file)+'/thumbnail?random='+Math.random();
  var data= {
    filename: file,
    page: currPage,
    filedimension: 150,
    pages: lastPage
  };
  var headers = {
    contentType: 'application/json'
  }

  if(url.indexOf('pdf') >= 0 ) {
      renderPDfThumbnail(url, data)
      return
  }
  $.ajax({
    url: url,
    type: "POST",
    beforeSend: function(request) {
      request.setRequestHeader("content-type", 'application/json');
    },
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success : function(data) {
      images = [];
      data.data.forEach(function (item, index) {
        dataval = "data:image/png;base64,"+item.substring(2, item.length-1);
        var name = "rdr-image_"+(index+1);
        var imageCreated = '<img id="'+name+'" src="'+dataval+'" />';
        images.push(imageCreated);
      });
        var display_thumbnail = $("#display-thumbnail");
        display_thumbnail.html(images);
        display_thumbnail.show();
    }
  });
}

var renderPDfThumbnailScroll = async function(url, dataGiven) {
  $.ajax({
    url: url,
    type: "POST",
    beforeSend: function(request) {
      request.setRequestHeader("content-type", 'application/json');
    },
    data: JSON.stringify(dataGiven),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success:  function(data) {
      imagesValue = []
      data.data.forEach(function (item, index) {
        imagesValue.push(pdfPageThumbnail(item,parseInt(dataGiven.page)+index));
      });
      const values =  pdfThumbnailOnScrollResponse(imagesValue);
  }
});

}

var renderPDfThumbnail = async function(url, data) {
  $.ajax({
    url: url,
    type: "POST",
    beforeSend: function(request) {
      request.setRequestHeader("content-type", 'application/json');
    },
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: async function(data) {
      images = [];
      imagesValue = []
      data.data.forEach(function (item, index) {
        imagesValue.push(pdfPageThumbnail(item,index));
      });
      const values =  pdfThumbnailResponse(imagesValue);
  }
});

}

const pdfThumbnailResponse = (imagesValue) => {
  const finalImages =  Promise.allSettled(imagesValue).then(function(values) {
      var imageVal = [];
      values.forEach((item, i) => {
        imageVal.push(item['value'])
      });
      var display_thumbnail = $("#display-thumbnail");
      display_thumbnail.html(imageVal);
      display_thumbnail.show();
   });
}

const pdfThumbnailOnScrollResponse = (imagesValue) => {
  const finalImages =  Promise.allSettled(imagesValue).then(function(values) {
      var imageVal = [];
      values.forEach((item, i) => {
        imageVal.push(item['value'])
      });
      var display_thumbnail = $("#display-thumbnail");
       $( "div[id^=display-thumbnail] img:last-child" ).remove();
      display_thumbnail.append(imageVal);
      display_thumbnail.show();
   });
}

const pdfPageThumbnail = (item, index) => {
  var pdfData = window.atob(item.substring(2, item.length -1));
  var loadingTask = pdfjsLib.getDocument({data: pdfData});
  var canvas = createCanvas("pdf-the-canvas-"+(index+1));
  return loadingTask.promise.then( pdf => {
              return  pdf.getPage(1);
            }).then( page => {
                       var scale = 1;
                       var viewport = page.getViewport({scale: scale});
                       var context = canvas.getContext('2d');
                       canvas.height = viewport.height;
                       canvas.width = viewport.width;
                       var renderContext = {
                         canvasContext: context,
                         viewport: viewport
                       };
                       var renderTask = page.render(renderContext);
                       return renderTask;
          }).then(renderTask => {
                  return renderTask.promise;
          }).then((task) => {
                   const uri = canvas.toDataURL('image/png');
                   var name = "rdr-image_"+(index+1);
                   var imageCreated = '<img id="'+name+'" src="'+uri+'" />';
                   canvas.remove();
                   return imageCreated;
          });
}

const createCanvas = (name) => {
  var canvasCreate = document.createElement('canvas');
  canvasCreate.setAttribute('id', name);
  canvasCreate.style.display = "none";
  document.body.appendChild(canvasCreate);
  return document.getElementById(canvasCreate.getAttribute('id'));
};

var renderPDF = function(url, data, showThumbnail) {
  $.ajax({
    url: url,
    type: "POST",
    beforeSend: function(request) {
      request.setRequestHeader("content-type", 'application/json');
    },
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function(data) {
      var pdfData = window.atob(data.data.substring(2, data.data.length -1));
      // Using DocumentInitParameters object to load binary data.
      var loadingTask = pdfjsLib.getDocument({data: pdfData});
      loadingTask.promise.then(function(pdf) {
        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
          var scale = 1;
          var viewport = page.getViewport({scale: scale});
          // Prepare canvas using PDF page dimensions
          var canvas = document.getElementById('the-canvas');
          var context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          var renderTask = page.render(renderContext);
          renderTask.promise.then(function () {
            const uri = canvas.toDataURL('image/png');
            var imaageCreated = '<img id="rdr-image" src="'+uri+'" />';
            $("#display-image").html(imaageCreated);
          });
        });
      }, function (reason) {
        // PDF loading error
        console.error(reason);
      });
      $("#totalpages").html(data.total_pages);
      $("#currentpage").val(data.page);
      $("#refCurrentPage").val(data.page);
    //  $("#filename").val(data.filename);
      if(showThumbnail) {
        $("#display-thumbnail").show();
      } else {
        $("display-thumbnail").hide();
      }
  }
});

}


var renderThumbNailOnScroll = function (filename, event, page) {
  var file = !!filename ? filename : $('#filename').val();
  var pagVal = page;
  var currPage = !!page ? page : $("#refCurrentPage").val();
  var lastPage =  $("#totalpages").html();
  var   url= findServicePath(file)+'/thumbnail?random='+Math.random();
  var data= {
    filename: file,
    page: currPage,
    filedimension: 150,
    pages: lastPage
  };
  if(url.indexOf('pdf') >= 0 ) {
      renderPDfThumbnailScroll(url, data)
      return
  }
  $.ajax({
    url: url,
    type: "POST",
    beforeSend: function(request) {
      request.setRequestHeader("content-type", 'application/json');
    },
    data: JSON.stringify(data),
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success : function(data) {
      images = [];
      var idOf = $( "div[id^=display-thumbnail] img:last-child").attr('id');
      rdrPage = idOf.match(/\d+/g)[0];
      data.data.forEach(function (item, index) {
        dataval = "data:image/png;base64,"+item.substring(2, item.length-1);
        var name = "rdr-image_"+(parseInt(rdrPage)+index);
        var imageCreated = '<img id="'+name+'" src="'+dataval+'" />';
        images.push(imageCreated);
      });
      var display_thumbnail = $("#display-thumbnail");
       $( "div[id^=display-thumbnail] img:last-child" ).remove();
      display_thumbnail.append(images);
      display_thumbnail.show();
    }
  });
}

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
