const fs = require('fs');
var mysqlDAO = require('../mysql/DAO');
var sqlbase = function(tablename){
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
             colnamelist=['voteid','like','postid','userid','commentid'];
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
          fs.writeFile('commentscount.txt', JSON.stringify(counts), 'utf8', function(err){
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
          fs.writeFile('postscount.txt', JSON.stringify(counts), 'utf8', function(err){
            console.log(err);
        });  
        }
        });

    }

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

var readpostscount=function(call){
    fs.readFile('postscount.txt', 'utf8', function(err,data){
            dataobj=JSON.parse(data);
            if(err){
                console.log(err);
            }else{
                call(dataobj);
            }
        }); 
};


var readcommentscount=function(call){
    fs.readFile('commentscount.txt', 'utf8', function(err,data){
            dataobj=JSON.parse(data);
            if(err){
                console.log(err);
            }else{
                call(dataobj);
            }
        }); 
};

 var updatefile=function(){
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
