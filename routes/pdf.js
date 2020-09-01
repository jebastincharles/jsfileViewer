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
  res.render('index', { title: 'Express', filename:filename, data: "", currentpage: 1, totalPages: 1});
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
        /*var dataImg= canvasAndContext.canvas.toDataURL('image/png');
        var imgname = "rdr-image";
        var data = '<img id='+imgname+' src="'+dataImg+'" ></img>';
        res.send({ title: 'Express', data: data, currentpage: currpage, totalPages: totalPages});
        */
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
  //console.log('img data...',thumbnails);

});

const getThumbnails = async function(req, res) {

  var currpage = !!req.body.page ? parseInt(req.body.page) : 1;
  var url = req.body.url ?  req.body.url : filename;
  var totalPages = !!req.body.totalpages ? parseInt(req.body.totalpages) : 0;

  if (!currpage) currpage = 1;
  var lastPage = currpage+4 > totalPages ? totalPages : currpage+4;
  var images = [];


  console.log('currpage..'+currpage)
  console.log('totalPages..'+totalPages)
  console.log('lastPage..'+lastPage)

  const loadingTask = pdfjsLib.getDocument(url);
  const pdf = await loadingTask.promise;
  var images = [];
      totalPages = pdf.numPages;
      var img;
    for (var i = currpage; i <= lastPage; i++) {
      img =  getThumbnailPage(pdf, i);
      //console.log('img..'+typeof(img));
      images.push(img);
    }

    const finalImages = await Promise.all(images).then(values =>{
        //console.log('in sending'+values);
        res.send({ images: values});
        //return values;

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
    //return  renderTask.promise.then(function () {
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
                console.log("|data rendered")
                return data;
                  //res.send({ title: 'Express', data: data, currentpage: currpage, totalPages: totalPages});
      });


}

module.exports = router;
