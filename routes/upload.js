var express = require('express');
var router = express.Router();
const fs = require('fs');
const os = require('os');
const sharp = require('sharp');
var Canvas = require("canvas");
const Promise = require('promise');
const await = require('await');
var formidable = require('formidable');
const pdfjsLib = require('pdfjs-dist/es5/build/pdf.js');
const URL = require('url');
var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/sample2.pdf";
const thumbNailCount = 5;
/* GET home page. */
router.post('/image', function(req, res, next) {
  var form = new formidable.IncomingForm();
   form.parse(req, function (err, fields, files) {
     console.log('files...'+files)
     console.log('files...'+files.photo.name)
     var oldpath = files.photo.path;
      var newpath = os.tmpdir()+'\\'+files.photo.name;
      console.log('newpath...'+newpath)
      fs.createReadStream(oldpath).pipe(fs.createWriteStream(newpath));
      console.log('newpath...'+newpath)
      res.send({ title: 'Express', filename:newpath});


   });
});



module.exports = router;
