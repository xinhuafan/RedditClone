var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('./mysql');

router.use(bodyParser.json());

router.route('/')
.all(function(req,res,next) {
      console.log('recv')
      res.render('index', { title: 'User Login In' });
      next();
})

.get(function(req,res,next){
})

.post(function(req, res, next){
})

.delete(function(req, res, next){
});
 
router.route('/:postid')
.all(function(req,res,next) {

    
    next();
})

.get(function(req,res,next){
    sqlquery='select * from posts where id='+req.params.postid;
    sqlquery1='select * from comments where postid='+req.params.postid;
    mysql.handle_database(req,res,sqlquery,function(rows){
        mysql.handle_database(req,res,sqlquery1,function(crows){
            res.render('detail', { title:rows[0].title,poster: rows[0].poster,pcontent:rows[0].content,comments:crows});
        });
    });
})

.post(function(req, res, next){
})

.delete(function(req, res, next){
});



module.exports = router;
