$(function(){
 $('#search').on('keyup', function(e){
   if(e.keyCode === 13) {
       
     var parameters = ({
    'request' : 'getpost',
    'postid' : $(this).val()
         
     });
     
    var jqxhr = $.ajax( {
                url: 'ajax/getposts',
                method: "GET",
                data: parameters,
                dataType: 'jason'
            } )
        .always(function(data) {
       $('#results').text(JSON.stringify(data['responseText']).replace("\\",''));
        });

    }
 });
});