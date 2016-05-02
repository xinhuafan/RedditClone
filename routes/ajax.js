var express = require('express');
var router = express.Router();
var mysqlDAO = require('../mysql/DAO');

var base= function(url ){
    router.route('/post／getpostbyuser')
    .all(function(req,res,next) {
    next();
    })
    .get(function(req,res,next){
        console.log('query: '+JSON.stringify(req.query));
        var params = [parseInt(req.query.userid)];
        mysqlDAO.Func.getpostbyuser(params,function(rows,errcode){
            var err;
            if(errcode<0){
                res.send(JSON.stringify(rows));
            }
            else if(errcode==1){
                err={'errorcode':'500','description':'SQL connection error'};
                res.send(JSON.stringify(err));
            }else{
                err={'errorcode':'500','description':'SQL execution error'};
                res.send(JSON.stringify(err));
            }
      
        });
    })
}


//getpostbyuser



//getpostbyuser
router.route('/post／getpost')
.all(function(req,res,next) {
   next();
})

.get(function(req,res,next){
    console.log('query: '+JSON.stringify(req.query));
    var params = [parseInt(req.query.postid)];
    mysqlDAO.Func.getpostbyuser(params,function(rows,errcode){
        var err;
        if(errcode<0){
            res.send(JSON.stringify(rows));
      }
      else if(errcode==1){
            err={'errorcode':'500','description':'SQL connection error'};
            res.send(JSON.stringify(err));
      }else{
            err={'errorcode':'500','description':'SQL execution error'};
            res.send(JSON.stringify(err));
      }
      
  });
})



module.exports = router;