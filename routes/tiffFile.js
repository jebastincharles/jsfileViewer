var express = require('express');
var router = express.Router();
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
//var Promise = require("bluebird");
const Promise = require('promise');
const await = require('await');
var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/multiSample.tif";
const thumbNailCount = 5;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', filename:filename, data: "", currentpage: 1, totalPages: 1});
});

router.get('/download', function(req, res, next) {
  var file = !!req.query.file ? req.query.file : filename;
  var name = path.basename(file);
  res.header('Content-Disposition', 'attachment; filename='+name);
  res.setHeader('Content-Type', 'image/tiff');
  var stream = fs.readFileSync(file);
  res.send(stream);
});
router.post('/render', function(req, res, next) {
  var currpage = req.body.page;
  var url = req.body.filename ?  req.body.filename : filename;
  var totalPages = 0;
  if (!currpage) currpage = 1;
  sharp(url).metadata().then(function(metadata){
    totalPages = !!metadata.pages ? metadata.pages : 1;
    console.log('metadata..'+metadata.pages);
  });
  var imageBuff = sharp(url, {page: parseInt(currpage)-1}).png().resize(675,585,{fit: sharp.fit.fill,
                                withoutEnlargement: true}).toBuffer().then((dataval) => {
      var dataImg= "data:image/png;base64,"+dataval.toString('base64');
      var data = '<img id="rdr-image" src="'+dataImg+'" />';
      res.send({ title: 'Express', filename:filename, data: data, currentpage: currpage, totalPages: totalPages});
    });
});

router.post('/rendernail', function(req, res, next) {

  getThumbnails(req, res);
});

const renderPageThumbnail = function(url, index) {
  return sharp(url,  {page: index-1, pages: 1}).png().resize(150,150,{fit: sharp.fit.fill,
                                withoutEnlargement: true}).toBuffer().then((dataval) => {
      var dataImg= "data:image/png;base64,"+dataval.toString('base64');
      var imgname = "rdr-image_"+index;
      var data = '<img id='+imgname+' src="'+dataImg+'" ></img>';
      return data;
    })
}

const getThumbnails = async function(req, res) {

  var currpage = !!req.body.page ? parseInt(req.body.page) : 1;
  var url = !!req.body.url ?  req.body.url : filename;
  var totalPages = !!req.body.totalpages ? parseInt(req.body.totalpages) : 0;
  if (!currpage) currpage = 1;
  var images = [];
  var lastPage = currpage+4 > totalPages ? totalPages : currpage+4;
  for (var i = currpage; i <= lastPage; i++) {
    images.push(renderPageThumbnail(url, i));
  }
  const finalImages = await Promise.all(images).then((values => res.send({ images: values})));
}
module.exports = router;
