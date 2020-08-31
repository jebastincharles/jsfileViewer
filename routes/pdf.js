var express = require('express');
var router = express.Router();
const fs = require('fs');
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
  res.render('index', { title: 'Express', data: "", currentpage: 1, totalPages: 1});
});

router.get('/download', function(req, res, next) {
  res.header('Content-Disposition', 'attachment; filename="sample.pdf"');
  res.setHeader('Content-Type', 'application/pdf');
  var stream = fs.readFileSync(filename);
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
  //  assert(canvasAndContext.canvas, "Canvas is not specified");
    //assert(width > 0 && height > 0, "Invalid canvas size");
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },

  destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
  //  assert(canvasAndContext.canvas, "Canvas is not specified");

    // Zeroing the width and height cause Firefox to release graphics
    // resources immediately, which can greatly reduce memory consumption.
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

router.get('/render', function(req, res, next) {
  var currpage = req.query.page;
  var url = req.query.url ?  req.query.url : filename;
  var totalPages = 0;

  if (!currpage) currpage = 1;

  getPage(filename, currpage, res);

});

const getPage = async function(filename, currpage,res) {

  var images = [];
  var totalPages = 0;

  const loadingTask = pdfjsLib.getDocument(filename);
  const pdf = await loadingTask.promise;

  // Load information from the first page.
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
        sharp(buff).png().resize(675, 575).toBuffer(function(err, dataval)  {
          console.error(err)
          var dataImg= "data:image/png;base64,"+dataval.toString('base64');
          var imgname = "rdr-image";
          var data = '<img id='+imgname+' src="'+dataImg+'" ></img>';
          res.send({ title: 'Express', data: data, currentpage: currpage, totalPages: totalPages});
         })
    });
  } catch(rxp) {
    console.log('in ')
    console.err(rxp);
  }

}

router.get('/rendernail', function(req, res, next) {
  var currpage = req.query.page ? parseInt(req.query.page) : 1;
  var url = req.query.url ?  req.query.url : filename;

  var totalPages = 0;
  if (!currpage) currpage = 1;

  const thumbnails = getThumbnails(res);
  //console.log('img data...',thumbnails);

});

const getThumbnails = async function(res) {


  var images = [];
  for (var i = 1; i <= 5; i++) {
    images.push(sharp(filename,  {page: i-1, pages: 1}).png().resize(150,150).toBuffer().then((dataval) => {
        var dataImg= "data:image/png;base64,"+dataval.toString('base64');
        var imgname = "rdr-image_"+i;
        var data = '<img id='+imgname+' src="'+dataImg+'" ></img>';
        return data;

      }));

  }
  const finalImages = await Promise.all(images).then((values => res.send({ images: values})));

}
module.exports = router;