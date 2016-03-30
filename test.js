var express = require('express');
var router = express.Router();
var mysql = require('mysql');


var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'tao',
    password : '123',
    database : 'rcdb',
    debug    :  false
});

SQLquery="select * from webUser";
var a=[];

function handle_database(SQLquery) {
    
    
    var conn= pool.getConnection(function(err,connection){
        console.log('connected as id ' + connection.threadId);
        connection.query(SQLquery,function(err,rows){
            console.log(rows.length)
            console.log(rows[1]);
            a.push(rows[1]);
            if(err) {
                console.log('error');
            }           
        });

  });
}

console.log('a is'+handle_database(SQLquery)[0]);