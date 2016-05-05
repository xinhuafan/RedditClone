 var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('../mysql/mysql');

router.use(bodyParser.json());


 
router.route('/comments/:postid')
.all(function(req,res,next) {

next();
})

.get(function(req,res,next){
    var username='';
    if(req.session.user){
        username=req.session.user;
        console.log('Loging!!! '+username);
    }else{
        console.log('no!!! '+username);
    }
    postid=req.params.postid
    res.render('newview/comment',{ccuserid:username,ccpostid:postid});
})

.post(function(req, res, next){
})

.delete(function(req, res, next){
});



module.exports = router;
