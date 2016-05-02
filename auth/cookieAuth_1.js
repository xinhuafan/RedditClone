var accountCheck = require('./accountCheck');
var session =require('express-session')


module.exports=function (req, res, next) {

    if (!req.signedCookies.user) {
        
        var authHeader = req.headers.authorization;
        if (!authHeader) {
            var err = new Error('You are not 1 authenticated!');
            err.status = 401;
            console.log('You are not 1 authenticated!');
            next(err);
            return;
        }
        var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
        var user = auth[0];
        var pass = auth[1];
        accountCheck.check(user,pass,function (rs){
        if (rs) {
            res.cookie('user',user,{signed: true});
            res.cookie('pass',pass,{signed: true});
            next(); // authorized
        }
        else {
            var err = new Error('You are not 2 authenticated!');
            console.log('You are not 2 authenticated!');
            err.status = 401;
            next(err);
        }
        });
    
    }
    else {
        console.log('have cookie, is : '+req.signedCookies.user)
        accountCheck.check(req.signedCookies.user,req.signedCookies.pass,
        function (rs){
            if(rs){
                next();
            }else {
            res.clearCookie('user');
            var err = new Error('You are not 3 authenticated!');
            console.log('You are not 3 authenticated!');
            err.status = 401;
            next(err);
        }
         });
        

    }
};