var express = require('express');
var router = express.Router();
var mysqlDAO = require('../mysql/DAO');


/* GET usermanage page. */
router.get('/', function(req, res, next) {
        var username='';
    if(req.session.user){
        
        username=req.session.user;
        console.log('Loging!!! '+username);
        
    }else{
        console.log('no!!! '+username);
    }

res.render('newview/index',{ccuserid:username});
  
  
});


router.get('/newview', function(req, res, next) {
    res.render('newview/newindex',{});
    
    
});


router.get('/newtest', function(req, res, next) {
    res.render('newtest',{});
    
    
});

router.post('/newajaxtest', function(req, res, next) {
    console.log(req.body);
    var val = (req.body.Thread_id);
    mysqlDAO.getpost(val,function(rows,errcode){
    console.log('rows is: '+JSON.stringify(rows));
    res.send(JSON.stringify(rows));   
   });
    
    
});

router.get('/newajaxtest', function(req, res, next) {
    console.log('query: '+JSON.stringify(req.query));
    var val = (req.query.Thread_id);
    mysqlDAO.getuserpost(val,function(rows,errcode){
    console.log('rows is: '+JSON.stringify(rows));
    res.send(JSON.stringify(rows));   
   });
    
    
});


module.exports = router;
