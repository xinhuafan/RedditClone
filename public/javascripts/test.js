$(function(){
 $('#search').on('keyup', function(e){
   if(e.keyCode === 13) {
       
     var parameters = ({
    'request' : 'getpostbyuser',
    'postid' : $(this).val()
         
     });
     
    var jqxhr = $.ajax( {
                url: 'ajax/getpostbyuser',
                method: "GET",
                data: parameters,
                dataType: 'jason'
            } )
        .always(function(data) {
        alert( JSON.stringify(data) );
        });

    }
 });
});