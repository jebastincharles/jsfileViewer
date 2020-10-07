var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
var Canvas = require("canvas");
const Promise = require('promise');
const await = require('await');
const pdfjsLib = require('pdfjs-dist/es5/build/pdf.js');
const URL = require('url');
var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/sample2.pdf";
const thumbNailCount = 5;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', filename:filename, data: "", currentpage: 1, totalPages: 1});
});

router.get('/download', function(req, res, next) {
  var file = !!req.query.file ? req.query.file : filename;
  var name = path.basename(file);
  res.header('Content-Disposition', 'attachment; filename='+name);
  res.setHeader('Content-Type', 'application/pdf');
  var stream = fs.readFileSync(file);
  res.send(stream);
});

function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
  create: function NodeCanvasFactory_create(width, height) {
  //  assert(width > 0 && height > 0, "Invalid canvas size");
    var canvas = Canvas.createCanvas(width, height);
    var context = canvas.getContext("2d");
    return {
      canvas: canvas,
      context: context,
    };
  },
  reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

router.post('/render', function(req, res, next) {
  var currpage = req.body.page;
  var url = req.body.filename ?  req.body.filename : filename;
  var totalPages = 0;
  if (!currpage) currpage = 1;
  getPage(url, currpage, res);
});

const getPage = async function(filename, currpage,res) {

  var images = [];
  var totalPages = 0;
  const loadingTask = pdfjsLib.getDocument(filename);
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(parseInt(currpage));
  totalPages = pdf.numPages;
  const scale = 1;
  const viewport = page.getViewport({scale: 1});
  var canvasFactory = new NodeCanvasFactory();
     var canvasAndContext = canvasFactory.create(
       viewport.width,
       viewport.height
     );
     // Render PDF page into canvas context
     var renderContext = {
        canvasContext: canvasAndContext.context,
        viewport: viewport,
        canvasFactory: canvasFactory,
      };
     var renderTask = page.render(renderContext);
    try {
      renderTask.promise.then(function () {
        const uri = canvasAndContext.canvas.toDataURL('image/png').split(';base64,').pop()
        var buff =  Buffer.from(uri, 'base64');
        sharp(buff).resize(675, 575, {fit: sharp.fit.fill}).withMetadata().toBuffer(function(err, dataval)  {
          console.error(err)
          var dataImg= "data:image/png;base64,"+dataval.toString('base64');
          var imgname = "rdr-image";
          var data = '<img id='+imgname+' src="'+dataImg+'" ></img>';
          res.send({ title: 'Express', filename:filename, data: data, currentpage: currpage, totalPages: totalPages});
        })
    });
  } catch(rxp) {
    console.log('in ')
    console.err(rxp);
  }
}

convertDataURIToBinary =  function(dataURI) {
         var BASE64_MARKER = ';base64,',
           base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length,
           base64 = dataURI.substring(base64Index),
           raw = window.atob(base64),
           rawLength = raw.length,
           array = new Uint8Array(new ArrayBuffer(rawLength));

         for (var i = 0; i < rawLength; i++) {
           array[i] = raw.charCodeAt(i);
         }
         return array;
       }

const getPage1 = async function(filename, currpage,res) {

  var pdfAsDataUri = "data:application/pdf;base64,JVBERi0xLjUK..."; // shortened
  var pdfAsArray = convertDataURIToBinary(pdfAsDataUri);
  pdfjsLib.getDocument(pdfAsArray)
  const page = await pdf.getPage(parseInt(currpage));
  totalPages = pdf.numPages;
  const scale = 1;
  const viewport = page.getViewport({scale: 1});
  var canvasFactory = new NodeCanvasFactory();
     var canvasAndContext = canvasFactory.create(
       viewport.width,
       viewport.height
     );
     // Render PDF page into canvas context
     var renderContext = {
        canvasContext: canvasAndContext.context,
        viewport: viewport,
        canvasFactory: canvasFactory,
      };
     var renderTask = page.render(renderContext);
    try {
      renderTask.promise.then(function () {
        const uri = canvasAndContext.canvas.toDataURL('image/png').split(';base64,').pop()
        var buff =  Buffer.from(uri, 'base64');
        sharp(buff).resize(675, 575, {fit: sharp.fit.fill}).withMetadata().toBuffer(function(err, dataval)  {
          console.error(err)
          var dataImg= "data:image/png;base64,"+dataval.toString('base64');
          var imgname = "rdr-image";
          var data = '<img id='+imgname+' src="'+dataImg+'" ></img>';
          res.send({ title: 'Express', filename:filename, data: data, currentpage: currpage, totalPages: totalPages});
        })
    });
  } catch(rxp) {
    console.log('in ')
    console.err(rxp);
  }
}


router.post('/rendernail', function(req, res, next) {
  const thumbnails = getThumbnails(req, res);
});

const getThumbnails = async function(req, res) {
  var currpage = !!req.body.page ? parseInt(req.body.page) : 1;
  var url = req.body.url ?  req.body.url : filename;
  var totalPages = !!req.body.totalpages ? parseInt(req.body.totalpages) : 0;
  if (!currpage) currpage = 1;
  var lastPage = currpage+4 > totalPages ? totalPages : currpage+4;
  var images = [];
  const loadingTask = pdfjsLib.getDocument(url);
  const pdf = await loadingTask.promise;
  var images = [];
      totalPages = pdf.numPages;
      var img;
    for (var i = currpage; i <= lastPage; i++) {
      img =  getThumbnailPage(pdf, i);
      images.push(img);
    }

    const finalImages = await Promise.all(images).then(values =>{
        res.send({ images: values});
     });
}

const getThumbnailPage = async function(pdfval, currpage) {
    var canvasFactory = new NodeCanvasFactory();
    const page = await pdfval.getPage(parseInt(currpage));
    const viewport = page.getViewport({scale: 1});
    var canvasAndContext = canvasFactory.create(
        viewport.width,
        viewport.height
    );
    var renderContext = {
         canvasContext: canvasAndContext.context,
         viewport: viewport,
         canvasFactory: canvasFactory,
    };
    var renderTask =  page.render(renderContext).promise ;
    var buff;
    return renderTask.then(task => {
      const uri = canvasAndContext.canvas.toDataURL('image/png').split(';base64,').pop()
       return Buffer.from(uri, 'base64');
    }).then(buff => {
          return sharp(buff).resize(150, 150, {fit: sharp.fit.fill,
                                              withoutEnlargement: true}).withMetadata().toBuffer()
      }). then(dataval  =>  {
                var dataImg= "data:image/png;base64,"+dataval.toString('base64');
                var imgname = "rdr-image_"+currpage;
                var data = '<img id='+imgname+' src="'+dataImg+'" ></img>';
                return data;
      });
}

module.exports = router;
