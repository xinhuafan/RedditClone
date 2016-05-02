var express = require('express');
var router = express.Router();
var mysqlDAO = require('../mysql/DAO');


/* GET home page. */
router.get('/', function(req, res, next) {

  var SQLquery = 'select * from posts';




  mysql.handle_database(SQLquery,function(rows,errcode){
      var err;
      if(errcode<0){
      res.render('index', { posts: rows });
      }
      else if(errcode==1){
            err = new Error('SQL connection error');
            err.status = 500;
            next(err);
      }else{
            err = new Error('SQL execution error');
            err.status = 500;
            next(err);
      }
  });
  
  
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
