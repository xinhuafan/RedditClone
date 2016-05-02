



var asmbl=function(rows,tablename){
    sqlobj=[]
    cols=s(tablename);
    for(var index in rows){
        for (var col in cols){
            
        }
    }
    
    
}


var s = function(tablename){
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
    
}