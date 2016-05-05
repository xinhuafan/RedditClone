/**
 * Created by Qiushuo on 4/22/2016.
 */
var User_Bar = function(session_user_name){

    var Login_Sates = {
        NOT_LOGIN: 0,
        LOGIN: 1
    }
    var login_state = Login_Sates.NOT_LOGIN;


    //user bar model
    function user_bar_model(user_id, user_name, login_state){
        var self = this;
        self._user_id = user_id;
        self._user_name = ko.observable(user_name);
        self._login_state = login_state;
        self._json;
    }


    $(document).ready(function(){
        var user_name = $("noscript#cuserid").text();
        //alert(user_name);
        session_user_name=user_name;
        if(session_user_name === ''){
            $(".user").hide();
        }
        else{
            //$(".user").show();
           // alert("login_user" + session_user_name);
            $(".guest").hide();
        }

        //ko binding
        var user_bar = new user_bar_model(0, session_user_name, Login_Sates.NOT_LOGIN);

        ko.applyBindings(user_bar, $(".user_bar")[0]);

        $("button#Sinup_user ").click(function(){
            //console.log("")
            $("section.fullpage_cover").toggle();
            $("input#widget_type").prop('checked', true);
        });
        $("button#Signin_user").click(function(){
            $("section.fullpage_cover").toggle();
            $("input#widget_type").prop('checked', false);
        });

    })


}

$(document).ready(function(){
    var user_name  = $("noscript#cuserid").text();
    User_Bar(user_name);
    
});



