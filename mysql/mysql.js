var mysql = require('mysql');


var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'tao',
    password : '123',
    database : 'rcdb2',
    debug    :  false
});


module.exports.handle_database=function(SQLquery,params,call) {
    
  console.log('Begin to SQLquery');
  pool.getConnection(function(err,connection){
      errcode=-1;
      // if connection error  
        if (err) {
          connection.release();
          errcode=1;
        }   
        
        console.log('connected as id ' + connection.threadId);
        console.log('SQLquery is ==> ' + SQLquery);
        connection.query(SQLquery,params,function(err,rows){
            if(!err) {
                console.log("Get rows, length is: " + rows.length);
                call(rows,errcode);
            }else{
                console.log(err)
                errcode=2;
                call([],errcode);
                console.log('error code is'+errcode)
                
            }
            connection.release();
        });

        // if query run error
        connection.on('error', function(err) {      
              errcode=1;    
        });
        
        
  });
 
};