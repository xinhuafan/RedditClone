var Login_Widget = function(current_user){
    this._current_user = current_user
    var Login_success = {
        request: "user_login",
        state: "success",
        user_name: "John"
    }

    var Login_fail = {
        request: "user_login",
        state: "failed",
        user_name: null
    }

    var Signin_success = {
        request: "user_signin",
        state: "success",
        user_name: "John"
    }

    var Signin_failed = {
        request: "user_signin",
        state: "success",
        user_name: null
    }

    function Signin_request(User_identity, password){
        this.request = "user_signin";
        this.username = User_identity;
        this.password = password;
    }

    function Signup_reuqest(user_name, email, password){
        this.request = "user_signup";
        this.username = user_name;
        //this.email = email;
        this.user_avatar = null;
        this.password = password;
    }

    function SigninInfo(identity_info, password){
        var self = this;
        self._identity_info = ko.observable(identity_info);
        self._password = ko.observable(password);
        self._signin_date; //date
        self.SignIn = function(){
            //console.log("sign in");
            var cur_date = new Date();
            self._signin_date = cur_date;
            var signin_info = new Signin_request(self._identity_info, self._password);
            console.log(signin_info);
            $.ajax({
                url: 'http://t5q583.koding.io:1991/Login/ajax',
                method: "POST",
                data: ko.toJS(signin_info),
                dataType: "json",
                success: function (data) {
                    alert(ko.toJSON(data));
                    if(!data.length){
                        console.log("data");
                    }
                    else{
                        location.reload();
                        var name = data[0].username;
                        $(".user_bar").find("guest").toggle();
                        $(".user_bar").find("user").toggle();
                        $("section.fullpage_cover").toggle();
                    }
                },
                error: function (xhr, status, error) {

                }
            });
        }
    }

    function SignupInfo(email, user_name, password){
        var self = this;
        self._email = ko.observable(email);
        self._user_name = ko.observable(user_name);
        self._password = ko.observable(password);
        self.Signup = function(){
            console.log("signup");
            var signup_info = new Signup_reuqest(self._user_name, self._email, self._password);
            $.ajax({
                url: 'http://t5q583.koding.io:1991/ajax/createuser',
                method: "POST",
                data: ko.toJS(signup_info),
                dataType: "json",
                success: function (data) {
                    alert(ko.toJSON(data));
                },
                error: function (xhr, status, error) {
                }
            });
        }
    }

    $(document).ready(function(){

        $("#widget_type").bind('change', function () {

            if ($(this).is(':checked'))
            {
                $("#signin-widget").css("display", "none");
                $("#signup-widget").css("display", "flex");
            }
            else
            {
                $("#signin-widget").css("display", "flex");
                $("#signup-widget").css("display", "none");
            }




        });

        $("section.fullpage_cover").hide();

        //
        var signin_form = new SigninInfo("","","");
        var signup_form = new SignupInfo("","");


        ko.applyBindings(signin_form, $("#signin-widget")[0]);
        ko.applyBindings(signup_form, $("#signup-widget")[0]);

        $(".close_dialog").click(function(){
            $("section.fullpage_cover").hide();
        })
    })

}
Login_Widget();