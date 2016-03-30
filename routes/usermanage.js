var express = require('express');
var router = express.Router();
var mysql = require('./mysql');




/* GET home page. */
router.get('/', function(req, res, next) {
    SQLquery="select * from webUser";
  mysql.handle_database(req,res,SQLquery,function(rows){
      res.render('usermanage', { usersinfo: rows });

  });
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