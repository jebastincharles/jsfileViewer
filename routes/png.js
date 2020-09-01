var express = require('express');
var router = express.Router();
const fs = require('fs');
const sharp = require('sharp');
const Promise = require('promise');
const await = require('await');
var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/sample-numbers.png";
const thumbNailCount = 5;
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("in png...");
  res.render('index', { title: 'Express', filename:filename, data: "", currentpage: 1, totalPages: 1});
});

router.get('/download', function(req, res, next) {
  res.header('Content-Disposition', 'attachment; filename="sample.png"');
  res.setHeader('Content-Type', 'image/png');
  var stream = fs.readFileSync(filename);
  res.send(stream);
});
router.post('/render', function(req, res, next) {
  var currpage = req.body.page;
  var url = !!req.body.filename ?  req.body.filename : filename;
  var totalPages = 0;

  if (!currpage) currpage = 1;

/*  var url ="https://file-examples-com.github.io/uploads/2017/10/file_example_TIFF_5MB.tiff";
  var filename = "C:/Users/jebastin/work/jsfileviewer/jsFileViewer/public/images/renderImg/multiSample.tif";
  var fileUrl = "http://localhost:3000/images/renderImg/multiSample.tif"; */

  sharp(url).metadata().then(function(metadata){
    totalPages = !!metadata.pages ? metadata.pages : 1;
    console.log('metadata..'+metadata.pages);
  });
  var imageBuff = sharp(url, {page: parseInt(currpage)-1}).png().resize(675,585,{fit: sharp.fit.fill,
                                withoutEnlargement: true}).toBuffer().then((dataval) => {
      var dataImg= "data:image/png;base64,"+dataval.toString('base64');
      var data = '<img id="rdr-image" src="'+dataImg+'" />';
      //console.log('img data...',dataImg);
      res.send({ title: 'Express', filename:filename, data: data, currentpage: currpage, totalPages: totalPages});
    });
});

router.post('/rendernail', function(req, res, next) {


  const thumbnails = getThumbnails(req, res);
  //console.log('img data...',thumbnails);

});

const getThumbnails = async function(req, res) {

  var currpage = !!req.body.page ? parseInt(req.body.page) : 1;
  var url = !!req.body.url ?  req.body.url : filename;

  var totalPages = 0;
  if (!currpage) currpage = 1;
  var totalPages = !!req.body.totalpages ? parseInt(req.body.totalpages) : 0;
  var lastPage = currpage+4 > totalPages ? totalPages : currpage+4;
  var images = [];
  for (var i = currpage; i <= lastPage; i++) {
    images.push(sharp(url,  {page: i-1, pages: 1}).png().resize(150,150,{fit: sharp.fit.fill,
                                  withoutEnlargement: true}).toBuffer().then((dataval) => {
        var dataImg= "data:image/png;base64,"+dataval.toString('base64');
        var imgname = "rdr-image_"+i;
        var data = '<img id='+imgname+' src="'+dataImg+'" ></img>';
        return data;

      }));

  }
  const finalImages = await Promise.all(images).then((values => res.send({ images: values})));

}
module.exports = router;
