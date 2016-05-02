var mysql=require('./mysql');
var base =function(sqlquery){
    return function(params,callback){
        console.log('receive params: '+params);
    mysql.handle_database(sqlquery,params,callback);
    } 
}

module.exports.Func={

getvotebypost : base('select * from vote where postid=?'),
getvotebycomment : base('select * from vote where commentid=?'),
getvotebyusert : base('select * from vote where userid=?'),

postvote: base('insert into vote (postid,userid,like) values(?,?,?)'),
commentvote: base('insert into vote (postid,userid,like) values(?,?,?)'),

getpost: base('select * from post where postid=?'),
getcomment: base('select * from comment where commentid=?'),

getpostbyuser : base('select * from post where userid=?'),
getcommentbyuser : base('select * from comment where userid=?')
    
};
