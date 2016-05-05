 var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('../mysql/mysql');

router.use(bodyParser.json());

router.route('/')
.all(function(req,res,next) {
      
      next();
})

.get(function(req,res,next){
})

.post(function(req, res, next){
})

.delete(function(req, res, next){
});
 
router.route('/comments?id=:postid')
.all(function(req,res,next) {


})

.get(function(req,res,next){

    res.render('newview/newindex',{});
})

.post(function(req, res, next){
})

.delete(function(req, res, next){
});



module.exports = router;
