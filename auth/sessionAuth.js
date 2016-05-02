var accountCheck = require('./accountCheck');



/*
var sess=session({
    secret:'random 128 bytes string',
    cookie:{maxAge:60 * 1000}
});
*/
var builtsess=function(req,username,password,callback){
    
}

var checksess=function(req,username,password,callback){
   
}

function authenticate(name, pass, callback) {
    accountCheck.check(name,pass,callback);

    
}

function requiredAuthentication(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/login');
    }
}