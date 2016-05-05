var path = require('path');
var mysqlDAO = require('../mysql/DAO');
var ModelInfo = require('../Model/Cache');



var pushpost=function(postid,posts,limit,i,call){
    mysqlDAO.Func.getpost([postid],function(rows,errcode){
        if (rows.length>0){
        posts.push(rows[0]);}
        if(itercount==limit){
          call(posts);

    }
    });
}

var getsortedposts = function(postids,call){
    posts=[];
    limit=postids.length-1;
    for(var i in postids){
         pushpost(postid,posts,limit,i,call);   
    
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
            console.log(temp+' '+cmpidx);
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
    
    ModelInfo.readuserscount(function(dataobj){
        var index=getindexbyuserid(dataobj,userid);
        bestindex=getbestmatch(dataobj,index);
        bestuserid=dataobj[bestindex]['userid'];
        dif=removeduplicate(getdif(dataobj,index,bestindex));
        call(dif);
    })
}

module.exports.getrecpostsforusers=getrecpostsforusers;
module.exports.getsortedposts=getsortedposts;
// getrecposts test
//getrecpostsforusers(5,function(dif){console.log(dif);})

