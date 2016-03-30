var express = require('express');
var router = express.Router();
var mysql = require('./mysql');


/* GET home page. */
router.get('/', function(req, res, next) {
  var selectSQL = 'select * from posts';
  mysql.handle_database(req,res,selectSQL,function(rows){
      res.render('index', { posts: rows });
  });
});




module.exports = router;
