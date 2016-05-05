var path = require('path');
var mysqlDAO = require('../mysql/DAO');
var ModelInfo = require('../Model/Cache');




var getindexbypostid=function(dataobj,postid){
    for(var idx in dataobj){
        if(dataobj[idx]['postid']==postid){
            return idx;
        }
    }
    console.log('error,cant find index by postid');
    return -1;
    
}

var getrepliedbyuser=function(call,userid){
        mysqlDAO.Func.getpostsGT([],function(rows,errcode){
        mysqlDAO.Func.getcommentbyuser([userid],function(rows2,errcode){
            rows2=rows2.map(function(obj){
                var postid =obj['postid'];
                for(var row of rows){
                    if(row['postid']==postid){
                        return row;
                    }
                }
                return {};
            });
            call(rows2);

        });
            
        });
}

var getlattestposts=function(call){
    mysqlDAO.Func.getpostsGT([],function(rows,errcode){
        var posts=rows.sort(function(a,b){
            return b.post_time.getTime()-a.post_time.getTime();
        });
        ModelInfo.readpostscount(function(dataobj){
            for(var row in rows){
                var inindex=getindexbypostid(dataobj,rows[row]['postid']);
                rows[row]['count']=dataobj[inindex]['count'];
            }
            call(rows);
        });
    });
}



var gethottestposts=function(call){
            ModelInfo.readpostscount(function(dataobj){
            dataobj=dataobj.sort(function(a,b){
                return b['count']-a['count'];
            });
            postids=dataobj.map(function(obj){
               var mapped={'postid':obj['postid'],'count':obj['count']};
               return mapped;
            });
            getsortedposts(postids,call)
        }); 
}


var pushpost=function(postid,count,posts,limit,i,call){
    mysqlDAO.Func.getpostGT([postid],function(rows,errcode){
        if (rows.length>0){
        row=rows[0];
        row['count']=count;
        posts.push(row);}
        if(i==limit){
          call(posts);

    }
    });
}

var getsortedposts = function(postids,call){
    posts=[];
    limit=postids.length-1;
    for(var i in postids){
        
         pushpost(postids[i]['postid'],postids[i]['count'],posts,limit,i,call);   
    
    }

}

var getdif=function(dataobj,a,b){
    var dif=[];
    var aa=dataobj[a].likeposts;
    var ba=dataobj[b].likeposts;
    for(var be of ba){
        if(aa.indexOf(be)<0){
            dif.push(be);
        }
    }
    return dif;
}

var getsm=function(dataobj,a,b){
    var aa=dataobj[a].likeposts;
    var ba=dataobj[b].likeposts;
    var sm=0;
    for(var ae of aa){
        for(var be of ba){
            if(ae===be){
                sm++;
            }
        }
    }
    return sm;
}

var getbestmatch=function(dataobj,index){
    var sm=0;
    var best=0;
    for( var cmpidx in dataobj){
        if(index!=cmpidx){
            var temp=getsm(dataobj,cmpidx,index);
            if(temp>sm){
                sm=temp;
                best=cmpidx;
            }
        }
    }
    return best;
}

var getindexbyuserid=function(dataobj,userid){
    for(var idx in dataobj){
        if(dataobj[idx]['userid']==userid){
            return idx;
        }
    }
    console.log('error,cant find index by userid');
    return -1;
    
}

var removeduplicate=function(arr){
    var result = arr.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
    })
    return result;
}

var getrecpostsforusers=function(userid,call){

    mysqlDAO.Func.getpostsGT([],function(rows,errcode){
        ModelInfo.readuserscount(function(dataobj){
        var index=getindexbyuserid(dataobj,userid);
        bestindex=getbestmatch(dataobj,index);
        bestuserid=dataobj[bestindex]['userid'];
        dif=removeduplicate(getdif(dataobj,index,bestindex));
        dif=dif.map(function(obj){
            var postid =obj;
            for(var row of rows){
                if(row['postid']==postid){
                    return row;
                }
            }
            return {};
                });
        call(dif);
        });
    });
}

module.exports.getrecpostsforusers=getrecpostsforusers;
module.exports.gethottestposts=gethottestposts;
module.exports.getlattestposts=getlattestposts;
module.exports.getrepliedbyuser=getrepliedbyuser;
// getrecposts test
//getrecpostsforusers(5,function(dif){console.log(dif);})

