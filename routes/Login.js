var express = require('express');
var router = express.Router();
var mysqlDAO = require('../mysql/DAO');
var ModelInfo = require('../Model/Cache');
var Rec = require('../Model/recPost');
var path = require('path');


var base= function(url,paramnames,func){
    router.route(url)
    .all(function(req,res,next) {
    next();  
    })
    .post(function(req,res,next){
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        console.log('body: '+JSON.stringify(req.body));
        var params = paramnames.map(function (obj){
            return (req.body)[obj];
        });
        console.log(params);
        func(req,params,function(rows,errcode){
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


var Login=base('/ajax',['username','password'],function(req,params,call){
    mysqlDAO.Func.loginuser(params,function(rows,errcode){
        console.log('try to Login');
        console.log(rows);
        if(rows.length>0){
            req.session.user=rows[0].username;
        }
        call(rows,-1);
    });
    
    
});
    

module.exports = router;