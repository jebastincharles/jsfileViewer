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





/* GET home page. */
router.get('/', function(req, res, next) {
  var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/MARBLES.TIF";
  var filename1 = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/G31D1.TIF";
/*  let image =  Image.load(filename);
  let grey = image
  .grey() // convert the image to greyscale.
    .resize({ width: 200 })
    .rotate(180); // rotate the image clockwise by 30 degrees.
grey.save(filename1); */

/*sharp(filename)
  .rotate()
  .resize(200)
  .toBuffer()
  .then( data => { console.log("data..."+data); })
  .catch( err => { console.log("err..."+err); }); */
/*
var input = fs.readFileSync(filename);
var image = new Tiff({ buffer: input });

console.log(filename + ': width = ' + image.width() + ', height = ' + image.height());
var canvas = image.toCanvas(); */
/*  const canvas = new canvasLibrary.createCanvas(200, 200);
  const canvasCtx = canvas.getContext('2d');

  // Write "Awesome!"
  canvasCtx.font = '30px Impact';
  canvasCtx.rotate(0.1);
  canvasCtx.fillText('Awesome!', 50, 100);

  // Draw line under text
  var text = canvasCtx.measureText('Awesome!');
  canvasCtx.strokeStyle = 'rgba(0,0,0,0.5)';
  canvasCtx.beginPath();
  canvasCtx.lineTo(50, 102);
  canvasCtx.lineTo(50 + text.width, 102);
  canvasCtx.stroke();
  var dataUrl = canvas.toDataURL(); */
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

router.get('/tt', function(req, res, next) {
  var url ="https://file-examples-com.github.io/uploads/2017/10/file_example_TIFF_5MB.tiff";

  GeoTIFF.fromUrl(url)
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
    });
  });


  var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/MARBLES.TIF";
console.log("1");
  var buffer = fs.readFileSync(filename);
  var image = new Tiff({ buffer: buffer });
console.log("2"+JSON.stringify(image));
  const ifds = UTIF.decode(buffer);
  const ifd2 = tiff.decode(buffer);
  console.log("tiff.pageCount(data)..."+tiff.pageCount(buffer))
    console.log("tiff.isMultiPage(data)..."+tiff.isMultiPage(buffer))
  console.log("3"+JSON.stringify(ifd2[0]));
  console.log("3.."+typeof ifd2[0]);
   const timage = ifds[0];
   console.log("4"+JSON.stringify(timage));
   UTIF.decodeImage(buffer, timage);
console.log("5");
var rgba = UTIF.toRGBA8(timage);
    //const array = new Uint8ClampedArray(UTIF.toRGBA8(timage));
    console.log("6");
    // Forming image Data
  //  const imageData = new ImageData(array, timage.width, timage.height);
  //  console.log('imageData...'+imageData);

  const canvas = createCanvas(timage.width, timage.height)
  const ctx = canvas.getContext('2d')
  var imageData = ctx.createImageData(timage.width, timage.height);
  for (var i = 0; i < rgba.length; i++) imageData.data[i] = rgba[i];
			ctx.putImageData(imageData, 0, 0);
  /*  if(timage) imageData.data.set(timage);
      console.log("10"+imageData);
      ctx.putImageData(imageData, timage.width, timage.height); */

  // Write "Awesome!"
  /*ctx.font = '30px Impact'
  ctx.rotate(0.9)
  ctx.fillText('Awesome!', 50, 100)timage

  // Draw line under text
  var text = ctx.measureText('Awesome!')
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'
  ctx.beginPath()
  ctx.lineTo(50, 102)
  ctx.lineTo(50 + text.width, 102)
  ctx.stroke() */

  // Draw cat with lime helmet
  loadImage('C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/sample-numbers.png').then((image) => {
    //ctx.drawImage(imageData, 50, 0, 70, 70)

    console.log('<img src="' + canvas.toDataURL() + '" />')
    res.send('<img src="' + canvas.toDataURL() + '" />');
  })
});



module.exports = router;
