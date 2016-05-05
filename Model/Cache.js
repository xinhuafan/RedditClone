const fs = require('fs');
var path = require('path');
var mysqlDAO = require('../mysql/DAO');
var getcolnamelist = function(tablename){
    var colnamelist;
    switch(tablename){
        case 'user':{
            colnamelist=['userid','username','password','user_avatar'];
            
        }break;
        case 'post':{
             colnamelist=['postid','title','post_type','post_time','postcontent','userid'];
        }break;
        case 'comment':{
             colnamelist=['commentid','comment_content','comment_time','postid','userid'];
        }break;
        case 'vote':{
             colnamelist=['voteid','islike','postid','userid','commentid'];
        }break;
        default:{
            colnamelist=[];
        }
    }
    
  return  colnamelist;
    
};


    var commentcountvote=function(commentid,counts,limit,itercount){
        mysqlDAO.Func.getvotebycomment([commentid],function(rows,errcode){
        var count=0;
        var like=0;
        var unlike=0;
        for(var row of rows){
            count += (row['islike'] == 1) ? 1 : -1;
            like += (row['islike'] == 1) ? 1 : 0;
            unlike += (row['islike'] == 1) ? 0 : 1;            
        }
        counts.push({'commentid':commentid,'like':like,'unlike':unlike,'count':count})
        console.log(itercount);
        if(itercount==limit){
          fs.writeFile(path.resolve(__dirname, '../serverData/commentscount.json'), JSON.stringify(counts), 'utf8', function(err){
            console.log(err);
        });  
        }
        });

    }
    
    var countvote=function(postid,counts,limit,itercount){
        mysqlDAO.Func.getvotebypost([postid],function(rows,errcode){
        var count=0;
        var like=0;
        var unlike=0;
        for(var row of rows){
            count += (row['islike'] == 1) ? 1 : -1;
            like += (row['islike'] == 1) ? 1 : 0;
            unlike += (row['islike'] == 1) ? 0 : 1;
        }
        counts.push({'postid':postid,'like':like,'unlike':unlike,'count':count})
        console.log(itercount);
        if(itercount==limit){
          fs.writeFile(path.resolve(__dirname, '../serverData/postscount.json'), JSON.stringify(counts), 'utf8', function(err){
            console.log(err);
        });  
        }
        });

    }


    var usercountvote=function(userid,counts,limit,itercount){
        mysqlDAO.Func.getvotebyuser([userid],function(rows,errcode){
        var countlike=[];
        var countunlike=[];
        for(var row of rows){
            if(row['postid']){
            if(row['islike']==1){
                countlike.push(row['postid']);
            }else{
                countunlike.push(row['postid']);
            }}
        }
        var uservote={};
        uservote['userid']=userid;
        uservote['likeposts']=countlike;
        uservote['unlikeposts']=countunlike;
        counts.push(uservote);
        if(itercount==limit){
          fs.writeFile(path.resolve(__dirname, '../serverData/usercountvote.json'), JSON.stringify(counts), 'utf8', function(err){
            console.log(err);
        });  
        }
        });

    }
    
    
var getuservote=function (userids){
    var counts=[];
    var limit=userids.length-1;
    for(var i in userids){
        var userid=userids[i];
        usercountvote(userid,counts,limit,i);
        
    }
};


var getpostscount=function (postids){
    var counts=[]
    var limit=postids.length-1;
    for(var i in postids){
        var postid=postids[i];
        countvote(postid,counts,limit,i);
        
    }
};

var getcommentscount=function (commentids){
    var counts=[]
    var limit=commentids.length-1;
    for(var i in commentids){
        var commentid=commentids[i];
        commentcountvote(commentid,counts,limit,i);
        
    }
};

var readuserscount=function(call){
    fs.readFile(path.resolve(__dirname, '../serverData/usercountvote.json'), 'utf8', function(err,data){
            dataobj=JSON.parse(data);
            if(err){
                console.log(err);
            }else{
                call(dataobj);
            }
        }); 
};


var readpostscount=function(call){
    fs.readFile(path.resolve(__dirname, '../serverData/postscount.json'), 'utf8', function(err,data){
            dataobj=JSON.parse(data);
            if(err){
                console.log(err);
            }else{
                call(dataobj);
            }
        }); 
};


var readcommentscount=function(call){
    fs.readFile(path.resolve(__dirname, '../serverData/commentscount.json'), 'utf8', function(err,data){
            dataobj=JSON.parse(data);
            if(err){
                console.log(err);
            }else{
                call(dataobj);
            }
        }); 
};

 var updatefile=function(){
    mysqlDAO.Func.getusers([],function(rows,errcode){
         userids=[];
         for(var row of rows){
             userids.push(row['userid']);
         }
         getuservote(userids);
     });
    mysqlDAO.Func.getposts([],function(rows,errcode){
         postids=[];
         for(var row of rows){
             postids.push(row['postid']);
         }
         getpostscount(postids);
     });
    mysqlDAO.Func.getcomments([],function(rows,errcode){
         commentids=[];
         for(var row of rows){
             commentids.push(row['commentid']);
         }         
         getcommentscount(commentids);
     });
 }


module.exports.updatefile=updatefile;
module.exports.readpostscount=readpostscount;
module.exports.readcommentscount=readcommentscount;
module.exports.readuserscount=readuserscount;
module.exports.getcolnamelist=getcolnamelist;