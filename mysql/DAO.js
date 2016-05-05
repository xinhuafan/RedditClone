var mysql=require('./mysql');
var base =function(sqlquery){
    return function(params,callback){
        console.log('receive params: '+params);
    mysql.handle_database(sqlquery,params,callback);
    } 
}

module.exports.Func={
    
//GET
loginuser: base('select * from user where username=? and password=?'),
getusers: base('select * from user'),

getposts: base('SELECT *  FROM post'),
getcomments: base('select * from comment'),
getcommentsbypost: base('select * from comment where postid=?'),

getpost: base('select * from post where postid=?'),
getcomment: base('select * from comment where commentid=?'),
getpostbyuser : base('select * from post where userid=?'),
getcommentbyuser : base('select * from comment where userid=?'),
getvotebypost : base('select * from vote where postid=?'),
getvotebycomment : base('select * from vote where commentid=?'),
getvotebyuser : base('select * from vote where userid=? and postid is not null'),

getpostsGT: base('SELECT *  FROM post LEFT JOIN user ON post.userid=user.userid'),
getcommentsbypostGT: base('select * from comment LEFT JOIN user ON comment.userid=user.userid where postid=?'),
getpostGT: base('select * from post LEFT JOIN user ON post.userid=user.userid where postid=?'),
//DELETE

deletepostbyid: base('delete from post where postid=?'),
deletecommentbyid: base('delete from comment where commentid=?'),

//CREATE
createpostwithid: base('insert into post (postid,title,post_type,post_time,post_content,userid) values(?,?,?,?,?,?)'),
createcommentwithid: base('insert into comment (commentid,comment_content,comment_time,postid,userid) values(?,?,?,?,?)'),
createpost: base('insert into post (title,post_type,post_time,post_content,userid) values(?,?,?,?,?)'),
createuser : base('insert into user (username,password,user_avatar) values(?,?,?)'),
postvote: base('insert into vote (postid,userid,islike) values(?,?,?)'),
commentvote: base('insert into vote (comment,userid,islike) values(?,?,?)'),

//UPDATE

updatecomment:base('UPDATE comment SET comment_content=?,comment_time=? where commentid=?'),
updatepost:base('')



     
};
