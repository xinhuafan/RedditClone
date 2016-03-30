var mysql = require('mysql');
var faker = require('faker');


var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'tao',
    password : '123',
    database : 'rcdb',
    debug    :  false
});


exports.handle_database=function(req,res,SQLquery,call) {
    
  pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        console.log("Run Query =>:"+SQLquery);
        connection.query(SQLquery,function(err,rows){
            if(!err) {
                call(rows);
                connection.release();
            }else{
                console.log("err: " + err);
            }         
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
 
}


