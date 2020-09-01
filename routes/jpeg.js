var express = require('express');
var router = express.Router();
const fs = require('fs');
const sharp = require('sharp');
const Promise = require('promise');
const await = require('await');
var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/jpeg.jpg";
const thumbNailCount = 5;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', filename:filename, data: "", currentpage: 1, totalPages: 1});
});

router.get('/download', function(req, res, next) {
  res.header('Content-Disposition', 'attachment; filename="sample.jpeg"');
  res.setHeader('Content-Type', 'image/jpeg');
  var stream = fs.readFileSync(filename);
  res.send(stream);
});
router.get('/render', function(req, res, next) {
  var currpage = req.query.page;
  var url = req.query.url ?  req.query.url : filename;
  var totalPages = 0;

  if (!currpage) currpage = 1;

/*  var url ="https://file-examples-com.github.io/uploads/2017/10/file_example_TIFF_5MB.tiff";
  var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/multiSample.tif";
  var fileUrl = "http://localhost:3000/images/renderImg/multiSample.tif"; */

  sharp(url).metadata().then(function(metadata){
    totalPages = metadata.pages;
    console.log('metadata..'+metadata.pages);
  });
  var imageBuff = sharp(filename, {page: parseInt(currpage)-1}).jpeg().resize(675,585,{fit: sharp.fit.fill,
                                withoutEnlargement: true}).toBuffer().then((dataval) => {
      var dataImg= "data:image/jpeg;base64,"+dataval.toString('base64');
      var data = '<img id="rdr-image" src="'+dataImg+'" />';
      //console.log('img data...',dataImg);
      res.send({ title: 'Express', filename:filename, data: data, currentpage: currpage, totalPages: totalPages});
    });
});

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
    images.push(sharp(filename,  {page: i-1, pages: 1}).jpeg().resize(150,150,{fit: sharp.fit.fill,
                                  withoutEnlargement: true}).toBuffer().then((dataval) => {
        var dataImg= "data:image/jpeg;base64,"+dataval.toString('base64');
        var imgname = "rdr-image_"+i;
        var data = '<img id='+imgname+' src="'+dataImg+'" ></img>';
        return data;

      }));

  }
  const finalImages = await Promise.all(images).then((values => res.send({ images: values})));

}
module.exports = router;
