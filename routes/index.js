var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', currentpage : 1, totalPages: 1, filename: "C:\\Users\\jebastin\\Desktop\\files\\multiSample.tif" });
});

module.exports = router;
