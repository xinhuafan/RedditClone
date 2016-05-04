var express = require('express');
var router = express.Router();
var mysqlDAO = require('../mysql/DAO');
var ModelInfo = require('../Model/Rec');

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



var getRecPosts=function(userid){
        
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
var getcommentsbypostGT= base('/getcommentsbypostGT',['postid'],mysqlDAO.Func.getcommentsbypostGT);




//POST
var loginuser=postbase('/userlogin',['username','password'],mysqlDAO.Func.loginuser)
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



var pushpost=function(postid,posts,limit,i){
    mysqlDAO.Func.getpost([postid],function(rows,errcode){
        if (rows.length>0){
        posts.push(rows[0]);}
        if(itercount==limit){
          fs.writeFile('../Model/usercountvote.txt', JSON.stringify(counts), 'utf8', function(err){
            console.log(err);
    });

    }
    });
}

var getsortedposts = function(postids,call){
    posts=[];
    limit=postids.length-1;
    for(var i in postids){
         pushpost(postid,posts,limit,i);   
    
    }

}

var gethottestposts= base('/gethottestposts',[],function(params,call){
    countlikeforpost(function(dataobj){
        dataobj.sort(function(a,b){
            return b['count']-a['count'];
        });
        call(dataobj.map(function(obj){
            return {postid:obj['postid'],'count':obj['count']};
        }),-1);
        
    });
});

var countlikeforpost = function(call){
    ModelInfo.readpostscount(call);
}

var countlikeforcomment = function(call){
    ModelInfo.readcommentscount(call);
}




module.exports = router;