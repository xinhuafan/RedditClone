var base =function(a){
    console.log('a'+JSON.stringify(arguments));
    return function(b,call){
    console.log(arguments);
    call(a+b);
    } 
}

var d = base(10);

d(3,function(e){
    console.log('e'+JSON.stringify(arguments));
}); 