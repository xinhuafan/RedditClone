var mysql = require('mysql');
var faker = require('faker');

var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var randomCard = faker.helpers.createCard(); // random contact card containing many properties

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'tao',
    password: '123',
    database:'rcdb',
    port: 3306
});

var comma='","';
var rcomma='",';
var lcomma=',"';
var ncomma=',';
var end='")';


var getusers=function(conn,call){
     var selectSQL='select * from webUser'
        conn.query(selectSQL,function(err,rows){
            if(!err) {
                  call(rows);
    
            }else{
                console.log("err: " + err);
            }         
        });
}

var getposts=function(conn,call){
     var selectSQL='select * from posts'
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
            console.log(row);
        }
    }
}

var userGenerator=function(conn,times){
var insertSQL = 'insert into webUser (name,password,email,address) values("' 
        for(var i=0;i<times;i++)
        {
            orsql=insertSQL;
            orsql+=faker.name.firstName()+'",';
            orsql+=faker.random.number()+',"';
            orsql+=faker.internet.email()+comma;
            orsql+=faker.address.streetAddress()+end;
            console.log('query is=>'+orsql);
            conn.query(orsql,errhandler);
            
        }
  conn.end();
}

var postsGenerator=function(conn,times){
    
    getusers(conn,function(rows){
        ids=[];
        names=[];
        for(var ii in rows){
            ids.push(rows[ii]['id']);
            names.push(rows[ii]['name']);
            }
        var insertSQL = 'insert into posts (title,poster,posterid,category,content) values("' 
        for(var i=0;i<times;i++)
        {
            index=Math.floor(ids.length*Math.random());
            console.log('find possible poster id:'+index);
            orsql=insertSQL;
            orsql+=faker.lorem.words()+comma;
            orsql+=names[index]+rcomma;
            orsql+=parseInt(ids[index])+lcomma;
            orsql+=faker.random.number()%10+comma;
            orsql+=faker.lorem.sentences()+end;
            console.log('query is=>'+orsql);
            conn.query(orsql,errhandler);
            
        }
        
        
});}

var commentsGenerator=function(conn,times){
    
    getposts(conn,function(prows){
        pids=[];
        for(var ii in prows){pids.push(prows[ii]['id']);}
        getusers(conn,function(rows){
            uids=[];
            for(var iii in rows){
            uids.push(rows[iii]['id']);
            }
        var insertSQL = 'insert into comments (postid,posterid,title,content,rating,category) values(' 
        for(var i=0;i<times;i++)
        {
            index1=Math.floor(pids.length*Math.random());
            index2=Math.floor(uids.length*Math.random());
            rt=Math.floor(5*Math.random());
            cat=Math.floor(1000*Math.random());
            orsql=insertSQL;
            orsql+=pids[index1]+ncomma;
            orsql+=uids[index2]+lcomma;
            orsql+=faker.lorem.words()+comma;
            orsql+=faker.lorem.sentence()+rcomma;
            orsql+=rt+ncomma;
            orsql+=cat+')';
            console.log('query is=>'+orsql);
            conn.query(orsql,errhandler);
            
        }
            
            
        });
    });
    
    

  
}



conn.connect();
commentsGenerator(conn,50);


