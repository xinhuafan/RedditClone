
var mysql = require('../mysql/mysql');

module.exports.check=function (user,pass,action) {
    
 console.log('get acoount check query: user is: '+user+' pass is: '+pass);
var selectSQL = 'select * from webUser';
selectSQL+= ' where name="'+user+'"';

var rs=false;
  mysql.handle_database(selectSQL,function(rows){
       for (var index in rows){
           if(rows[index].name==user && rows[index].password==pass){
               rs=true;
           }
       }
       action(rs);
  });
  

    
    
}