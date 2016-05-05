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
    .get(function(req,res,next){
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        console.log('query: '+JSON.stringify(req.query));
        var params = paramnames.map(function (obj){
            return (req.query)[obj];
        });
        console.log(params);
        func(params,function(rows,errcode){
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



var postbase= function(url,paramnames,func){
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
        func(params,function(rows,errcode){
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






//GET

var getcommentsbypost= base('/getcommentsbypost',['postid'],mysqlDAO.Func.getcommentsbypost);
var getposts= base('/getposts',[],mysqlDAO.Func.getposts);
var getvotebypost= base('/getvotebypost',['postid'],mysqlDAO.Func.getvotebypost);
var getvotebycomment= base('/getvotebycomment',['commentid'],mysqlDAO.Func.getvotebycomment);
var getvotebyusert= base('/getvotebyusert',['userid'],mysqlDAO.Func.getvotebyusert);
var getpost= base('/getpost',['postid'],mysqlDAO.Func.getpost);
var getcomment= base('/getcomment',['commentid'],mysqlDAO.Func.getcomment);
var getpostbyuser= base('/getpostbyuser',['userid'],mysqlDAO.Func.getpostbyuser);
var getcommentbyuser= base('/getcommentbyuser',['userid'],mysqlDAO.Func.getcommentbyuser);

var getpostsGT= base('/getpostsGT',[],mysqlDAO.Func.getpostsGT);
var getpostGT= base('/getpostGT',['postid'],mysqlDAO.Func.getpostGT);

var getrepliedbyuser=base('/getrepliedbyuser',['userid'],function(params,call){
        var userid=params[0]; 
        Rec.getrepliedbyuser(function(posts){
            call(posts,-1);
        },userid);

});

var getrecpostsforuser=base('/getrecpostsforuser',['userid'],function(params,call){
        var userid=params[0];
        Rec.getrecpostsforusers(userid,function(posts){
            call(posts,-1);
        });

});


var gethottestposts=base('/gethottestposts',[],function(params,call){
        Rec.gethottestposts(function(posts){
            call(posts,-1);
        });

});

var getlattestposts=base('/getlattestposts',[],function(params,call){
        Rec.getlattestposts(function(posts){
            call(posts,-1);
        });

});

var getcommentsbypostGT= base('/getcommentsbypostGT',['postid'],function(params,call){
    
    mysqlDAO.Func.getcommentsbypostGT(params,function(rows,errcode){
        countlikeforcomment(function(dataobj){
            var result=rows.map(function(obj){
                for(var elem of dataobj){
                    if(elem.commentid==obj.commentid){
                        obj['count']=elem['count'];
                        break;
                    }
                }
                return obj;
            });
            call(result,-1);
        });
    });
});

var getselectpostsGT= base('/getselectpostsGT',['postid'],function(params,call){
    
});


//POST
var loginuser=postbase('/userlogin',['username','password'],mysqlDAO.Func.loginuser);


var createuser= postbase('/createuser',['username','password','user_avatar'],mysqlDAO.Func.createuser);

    
//UPDATE
var updatecomment=postbase('/updatecomment',['comment_content','comment_time','commentid'],mysqlDAO.Func.updatecomment)

//DELETE

var deletepostbyid= base('/deletepostbyid',['psotid'],mysqlDAO.Func.deletepostbyid);
var deletecommentbyid= base('/deletecommentbyid',['commentid'],mysqlDAO.Func.deletecommentbyid);

//CREATE

var createpostwithid= base('/createpostwithid',['postid','title','post_type','post_time','post_content','userid'],mysqlDAO.Func.createpostwithid);

var createcommentwithid= base('/createcommentwithid',['commentid','comment_content','comment_time','postid','userid'],mysqlDAO.Func.createcommentwithid);


var createpost= base('/createpost',['title','post_type','post_time','post_content','userid'],mysqlDAO.Func.createpost);


var postvote= base('/postvote',['postid','userid','like'],mysqlDAO.Func.postvote);

var commentvote= base('/commentvote',['postid','userid','like'],mysqlDAO.Func.commentvote);



var getpostsGTGT= base('/getpostsGTGT',[],function(params,call){
    mysqlDAO.Func.getpostsGT([],function(rows,errcode){
            countlikeforpost(function(dataobj){
            var start=dataobj[0]['postid'];
            for(var row in rows){
                var id=rows[row]['postid'];
                var corelem=dataobj[id-start];
                if(row!=18)
                var count=corelem['count'];
                rows[row]['count']=count;
                
            }
            call(rows,-1);
        
        
    });
        
    });
    

});

var countlikeforpost = function(call){
    ModelInfo.readpostscount(call);
}

var countlikeforcomment = function(call){
    ModelInfo.readcommentscount(call);
}




module.exports = router;