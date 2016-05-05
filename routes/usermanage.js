 var express = require('express');
var router = express.Router();
var mysqlDAO = require('../mysql/DAO');




router.route('/')
.all(function(req,res,next) {
    
next();
})

.get(function(req,res,next){
    console.log('get it');
    mysqlDAO.Func.getusers([],function(rows,errcode){
        if(errcode<0){
       res.render('usermanage', { usersinfo: rows });
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

})

.post(function(req, res, next){
})

.delete(function(req, res, next){
});



router.get('/delete/:id', function(req, res, next) {
    id=req.params.id;
    SQLquery='delete from webUser';
    SQLquery+=' where id='+id;

  mysql.handle_database(req,res,SQLquery,function(rows){
      
       res.redirect('/usermanage');

  });
});

module.exports = router;