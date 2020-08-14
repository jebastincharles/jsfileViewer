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
const { createCanvas, loadImage } = require('canvas')

const UTIF = require("UTIF");
//const sharp = require('sharp');



let filename1 = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/G31D1.TIF";
var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/multiSample.tif";


/* GET home page. */
router.get('/', function(req, res, next) {
  var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/MARBLES.TIF";

  const width = 1200
  const height = 600

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  const text = 'Hello, World!'

  context.font = 'bold 70pt Menlo'
  context.textAlign = 'center'
  context.fillStyle = '#fff'
  context.fillText(text, 600, 170)
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
  /*  var result = GeoTIFF.fromUrl(fileUrl)
  .then(tiff => {

  tiff.getImage().then((image) => {
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

  var data =   image.readRGB().then((data) => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  var imageData = ctx.createImageData(width, height);
  for (var i = 0; i < data.length; i++)
  imageData.data[i] = data[i];
  ctx.putImageData(imageData, 0, 0);
  //console.log("canvas.toDataURL()>>>.."+canvas.toDataURL());
  return canvas.toDataURL();
  //return '<img src="' + canvas.toDataURL() + '" />';
})
data.then(value => {
console.log("value..."+value.length);
res.send('<img src="' + value + '" />');

})

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

const ifds = UTIF.decode(buffer);
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

loadImage('C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/sample-numbers.png').then((image) => {
  console.log("ref..."+canvas.toDataURL().length);
  var data = '<img id="tiffPage" src="' + canvas.toDataURL() + '" />';
  res.send({ title: 'Express', data: data, currentpage: currpage + 1, totalPages: pageCount});
})
});



module.exports = router;
