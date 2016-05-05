var mysql = require('mysql');
var faker = require('faker');
var eventproxy = require('eventproxy');
var superagent = require('superagent');
var cheerio = require('cheerio');
var url = require('url');

var sourceURL = 'https://www.reddit.com/';

var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var randomCard = faker.helpers.createCard(); // random contact card containing many properties

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'tao',
    password: '123',
    database:'rcdb2',
    port: 3306
});

var comma='","';
var rcomma='",';
var lcomma=',"';
var ncomma=',';
var end='")';



var getpostfromrd=function(topics,topicUrls,callback){

superagent.get(sourceURL)
  .end(function (err, res) {
    if (err) {
      return console.error(err);
    }
    var $ = cheerio.load(res.text);
    $('a.title').each(function (idx, element) {
      var $element = $(element);
      var href = url.resolve(sourceURL, $element.attr('href'));
      var title=$element.text();
      topicUrls.push(href);
      topics.push(title);
    });
callback();
  });
    
}


var getusers=function(conn,call){
     var selectSQL='select * from user'
        conn.query(selectSQL,function(err,rows){
            if(!err) {
                  call(rows);
    
            }else{
                console.log("err: " + err);
            }         
        });
}

var getposts=function(conn,call){
     var selectSQL='select * from post'
        conn.query(selectSQL,function(err,rows){
            if(!err) {
                  call(rows);
            }else{
                console.log("err: " + err);
            }         
        });
}

var getcomments=function(conn,call){
     var selectSQL='select * from comment'
        conn.query(selectSQL,function(err,rows){
            if(!err) {
                  call(rows);
    
            }else{
                console.log("err: " + err);
            }         
        });
}


var errhandler=function (err, rows) {
    if (err) console.log(err);
    else{
        for(var row in rows){
            console.log('Sucess!!');
        }
    }
}

var userGenerator=function(conn,times){
var insertSQL = 'insert into user (username,password,user_avatar) values("';
        for(var i=0;i<times;i++)
        {
            orsql=insertSQL;
            orsql+=faker.name.firstName()+rcomma;
            orsql+=faker.random.number()+lcomma;
            orsql+=faker.internet.avatar()+end;
            console.log('query is=>'+orsql);
            conn.query(orsql,errhandler);
            
        }
  conn.end();
}

var postsGenerator=function(conn,times){
    topics=[];
    topicUrls=[];
    getpostfromrd(topics,topicUrls,function(){
        console.log(topics);
        console.log(topicUrls);
        getusers(conn,function(rows){
        ids=[];
        for(var ii in rows){
            ids.push(rows[ii]['userid']);
            }
        var insertSQL = 'insert into post (title,post_type,post_time,post_content,userid) values("' 
        for(var i=0;i<times&&i<topics.length;i++)
        {
            index=Math.floor(ids.length*Math.random());
            console.log('find possible poster id:'+index);
            orsql=insertSQL;
            orsql+=topics[i]+rcomma;
            orsql+=faker.random.number()%20+ncomma;
            orsql+=JSON.stringify(faker.date.recent())+lcomma;
            orsql+=topicUrls[i]+rcomma;
            orsql+=ids[index]+')';
            console.log('query is=>'+orsql);
            conn.query(orsql,errhandler);
            
        }
        
        
});
        
        
        
    });
    
}

var commentsGenerator=function(conn,times){
    
    getposts(conn,function(prows){
        pids=[];
        uids=[];
        for(var ii in prows){
            pids.push(prows[ii]['postid']);
            uids.push(prows[ii]['userid']);
        }

        var insertSQL = 'insert into comment (comment_content,comment_time,postid,userid) values("' 
        for(var i=0;i<times;i++)
        {
            index1=Math.floor(pids.length*Math.random());
            orsql=insertSQL;
            orsql+=faker.lorem.sentence()+rcomma;
            orsql+=JSON.stringify(faker.date.recent())+ncomma;
            orsql+=pids[index1]+ncomma;
            index1=Math.floor(pids.length*Math.random());
            orsql+=uids[index1]+')';
            console.log('query is=>'+orsql);
            conn.query(orsql,errhandler);
            
        }
            
            
        });

    
    

  
}



var voteGenerator=function(conn,time1,time2){
    
    getcomments(conn,function(prows){
        var insertSQL = 'insert into vote (islike,userid,postid,commentid) values(?,?,?,?)'
        for(var i=0;i<time1;i++)
        {
            var like=faker.random.boolean();
            var userid=Math.floor(Math.random()*20)+1;
            var commentid=Math.floor(Math.random()*100)+51;
            var postid=Math.floor(Math.random()*20)+20;
            var params=[0,userid,postid,null]
            console.log('query is=>'+insertSQL);
            conn.query(insertSQL,params,errhandler);
            
        }
        
        for( i=0;i<time2;i++)
        {
             like=faker.random.boolean();
             userid=Math.floor(Math.random()*20)+1;
             commentid=Math.floor(Math.random()*100)+51;
             postid=Math.floor(Math.random()*20)+20;
             params=[0,userid,null,commentid]
            console.log('query is=>'+insertSQL);
            conn.query(insertSQL,params,errhandler);
            
        }
            
            
        });

    
    

  
}



conn.connect();

voteGenerator(conn,150,500);

