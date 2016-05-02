var express = require('express');
var router = express.Router();
var mysql = require('../mysql/mysql');
var accountCheck = require('../auth/accountCheck');




var newuser = {"id": 0,"name": '',"Avatar": "", "password": "root","abbr": "CEO","description": "so handsome"};
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.route('/login*')
.all(function(req,res,next) {
    next();
})

.get(function(req,res,next){
    res.render('login', {  });
})

.post(function(req, res){
    var s=req.body;
    console.log('post:'+JSON.stringify(s));
    accountCheck.check(s.username,s.password,function checkresult(rs){
        if(rs){
            req.session.user=s.username;
            //console.log(req.session);
            res.redirect('/');
        }else{
        req.session.error = 'Macth denied!';
        res.redirect('/users/login');
        }
    });

    
})

.delete(function(req, res, next){
});


router.route('/register*')
.all(function(req,res,next) {
    next();
})

.get(function(req,res,next){
    res.render('rgst', {  });
})

.post(function(req, res){
    var s=req.body
    if (s['password-repeat'] != s['password']) {
        req.flash('error', 'two passwored do not equal');
        return res.redirect('/reg');
        }
    var orsql='insert into webUser (name,password,email,address) values("';
    orsql+=s['username']+'","';
    orsql+=s['password']+'", "';
    orsql+=s['email']+'","';
    orsql+='address.none")';
    console.log('The query is:'+orsql);
    mysql.handle_database(req,res,orsql,function(){
               res.redirect('/');
    });

})

.delete(function(req, res, next){
});


module.exports = router;
