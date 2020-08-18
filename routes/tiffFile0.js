var express = require('express');
var tiff = require('tiff');
var router = express.Router();
var fs = require('fs');
const { decode } = require("decode-tiff");

const { PNG } = require("pngjs");
const GeoTIFF = require('geotiff');

var Tiff = require('tiff.js');
//const canvasLibrary = require('canvas');

const { Image } = require('image-js');
//const { createCanvas, loadImage } = require('canvas')

const UTIF = require("UTIF");
const sharp = require('sharp');



let filename1 = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/G31D1.TIF";
var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/multiSample.tif";


/* GET home page. */
router.get('/', function(req, res, next) {
  var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/MARBLES.TIF";
  res.render('index', { title: 'Express', data: "", currentpage: 1, totalPages: 1});
});

router.get('/download', function(req, res, next) {
  res.header('Content-Disposition', 'attachment; filename="sample.tiff"');
  res.setHeader('Content-Type', 'image/tiff');
  var stream = fs.readFileSync(filename);
  res.send(stream);

});
router.get('/tt', function(req, res, next) {
  var currpage = req.query.page;

  if (!currpage) currpage = 0;
  else currpage = currpage -1;
  console.log("currpage.."+currpage);
  var url ="https://file-examples-com.github.io/uploads/2017/10/file_example_TIFF_5MB.tiff";
  var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/multiSample.tif";
  var fileUrl = "http://localhost:3000/images/renderImg/multiSample.tif";

  var pageCount = 0;
  sharp(filename).metadata().then(function(metadata){
    pageCount = metadata.pages;
    console.log('metadata..'+metadata.pages);
  });
    var buufData = sharp(filename, {page: 2}).png().rotate(-90).toBuffer().then((dataval) => {
      var dataImg= "data:image/png;base64,"+dataval.toString('base64');
      var data = '<img id="tiffPage" src="'+dataImg+'" />';
      console.log('img data...',dataImg);
      //res.send(data);
      res.send({ title: 'Express', data: data, currentpage: 1, totalPages: pageCount});

    });


// geo tiff
    var result = GeoTIFF.fromUrl(fileUrl).then(tiff => {
      tiff.getImageCount().then(count => console.log("tiff.getImageCount().."+count));
      var canvasval = tiff.getImage(0).then((image) => {
          const width = image.getWidth();
          const height = image.getHeight();
          const tileWidth = image.getTileWidth();
          const tileHeight = image.getTileHeight();
          const samplesPerPixel = image.getSamplesPerPixel();
          console.log("image.."+image);
          console.log("width.."+width);
          console.log("height.."+height);
          console.log("tileWidth.."+tileWidth);
          console.log("tileHeight.."+tileHeight);
          console.log("samplesPerPixel.."+samplesPerPixel);

          /*console.log("bbox.."+JSON.stringify(image.getFileDirectory()));

          const bbox = image.getBoundingBox();

          const left = 50;
const top = 10;
const right = 150;
const bottom = 60; */

         return image.readRasters().then((data) => {

          // console.log("rgb data.."+data);
        /*  const canvas = createCanvas(width, height)
          const ctx = canvas.getContext('2d')
          var imageData = ctx.createImageData(width, height);
          //for (var i = 0; i < data.length; i++)
          //  imageData.data[i] = data[i];
            ctx.putImageData(data[0], 0, 0);
          console.log("canvas.toDataURL()>>>.."+canvas.toDataURL());
          var data = '<img id="tiffPage" src="' + canvas.toDataURL() + '" />';
          res.send({ title: 'Express', data: data, currentpage:  1, totalPages: 1});

          return canvas.toDataURL(); */
        });

      //return '<img src="' + canvas.toDataURL() + '" />';
      });
    });

/*const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')
var imageData = ctx.createImageData(width, height);
for (var i = 0; i < image.length; i++)
imageData.data[i] = image[i];
ctx.putImageData(imageData, 0, 0);
console.log("canvas.toDataURL().."+canvas.toDataURL());
res.send('<img src="' + canvas.toDataURL() + '" />'); */

/*    });
});
console.log("result.."+result); */
//res.send(result);
console.log("1");
var buffer = fs.readFileSync(filename);

// image-js tiffPage
/*
<h1>invalid compression: 7</h1>
<h2></h2>
<pre>Error: invalid compression: 7
    at TIFFDecoder.readStripData (C:\Users\jebastin\work\jsfileviewer\jsFileViewer\node_modules\tiff\lib\tiffDecoder.js:199:27)
    at TIFFDecoder.decodeImageData (C:\Users\jebastin\work\jsfileviewer\jsFileViewer\node_modules\tiff\lib\tiffDecoder.js:150:22)
    at TIFFDecoder.decodeIFD (C:\Users\jebastin\work\jsfileviewer\jsFileViewer\node_modules\tiff\lib\tiffDecoder.js:99:18)
    at TIFFDecoder.decode (C:\Users\jebastin\work\jsfileviewer\jsFileViewer\node_modules\tiff\lib\tiffDecoder.js:53:30)
    at Object.decodeTIFF [as decode] (C:\Users\jebastin\work\jsfileviewer\jsFileViewer\node_modules\tiff\lib\index.js:10:20)
    at C:\Users\jebastin\work\jsfileviewer\jsFileViewer\routes\tiffFile.js:98:22
    at Layer.handle [as handle_request] (C:\Users\jebastin\work\jsfileviewer\jsFileViewer\node_modules\express\lib\router\layer.js:95:5)
    at next (C:\Users\jebastin\work\jsfileviewer\jsFileViewer\node_modules\express\lib\router\route.js:137:13)
    at Route.dispatch (C:\Users\jebastin\work\jsfileviewer\jsFileViewer\node_modules\express\lib\router\route.js:112:3)
    at Layer.handle [as handle_request] (C:\Users\jebastin\work\jsfileviewer\jsFileViewer\node_modules\express\lib\router\layer.js:95:5)</pre>

*/
/*const imgifds = tiff.decode(buffer)
const imgfirst = imgifds[0];
const data = imgfirst.data;
console.log('imgfirst.data..'+data); */

// UTIF
/*const ifds = UTIF.decode(buffer);
const timage = ifds[0];
var pageCount = ifds.length;
UTIF.decodeImage(buffer, timage, ifds);
console.log("5");
var rgba = UTIF.toRGBA8(timage);
//const array = new Uint8ClampedArray(UTIF.toRGBA8(timage));
console.log("6");
const canvas = createCanvas(timage.width, timage.height)
const ctx = canvas.getContext('2d')
var imageData = ctx.createImageData(timage.width, timage.height);
for (var i = 0; i < rgba.length; i++)
imageData.data[i] = rgba[i];
ctx.putImageData(imageData, 0, 0);

// rotate

/*ctx.clearRect(0,0,canvas.width,canvas.height);

// save the unrotated context of the canvas so we can restore it later
// the alternative is to untranslate & unrotate after drawing
ctx.save();

// move to the center of the canvas
ctx.translate(canvas.width/2,canvas.height/2);

// rotate the canvas to the specified degrees
ctx.rotate(45*Math.PI/180);

// draw the image
// since the context is rotated, the image will be rotated also
ctx.drawImage(rgba,-timage.width/2,-timage.height/2); */

// we’re done with the rotating so restore the unrotated context
//  context.restore();

/*
loadImage('C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/sample-numbers.png').then((image) => {
  //console.log("ref..."+canvas.toDataURL().length);
  var data = '<img id="tiffPage" src="' + canvas.toDataURL() + '" />';
  res.send({ title: 'Express', data: data, currentpage: currpage + 1, totalPages: pageCount});
})  */
});



module.exports = router;
