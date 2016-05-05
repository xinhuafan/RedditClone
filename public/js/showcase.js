var index_showcase = function(session_current_user){

    var thread_load_num =10;

    var getHottest = {
        request: "get_Hottest_threads",
        num: thread_load_num,
        postid: 25
    }

    var getLatest = {
        request: "get_Latest_threads",
        num: thread_load_num
    }

    var getUserReplied = {
        request: "get_User_replied",
        num: thread_load_num
    }

    var getRecommanded = {
        request: "get_Recommended",
        num: thread_load_num
    }

    function pastTime(old_time, current_time){
        var time_last ={
            second : " seconds ago",
            minute : " mintes ago",
            hour: " hours ago",
            day: " days ago",
            month: " monthes ago",
            year: "years ago",
            second_offset: 6,
            mintes_offset: 5
        };


        var result;

        var differ;

        if(old_time.getFullYear()!= current_time.getFullYear()){
            var year_differ = current_time.getFullYear() - old_time.getFullYear();
            differ = year_differ;
            result = year_differ + time_last.year;
        }
        else if(old_time.getMonth()!=current_time.getMonth()){
            var month_differ = current_time.getMonth() - old_time.getMonth();
            differ = month_differ;
            result = month_differ + time_last.month;
        }
        else if(old_time.getDay()!=current_time.getDay()){
            var day_differ = current_time.getDay()- old_time.getDay();
            differ = day_differ;
            result = day_differ + time_last.day;
        }
        else if(old_time.getHours()!=current_time.getHours()){
            var hour_differ = current_time.getHours() - old_time.getHours();
            differ = hour_differ;
            result = hour_differ + time_last.hour;
        }
        else if(old_time.getMinutes()!=current_time.getMinutes()){
            var minutes_differ = current_time.getMinutes() - old_time.getMinutes();
            differ = minutes_differ;
            result = minutes_differ + time_last.mintue;
        }
        else{
            differ = 0;
            result = "0 minutes ago";
        }

        return result;
        //return time_last.hour;
    }



    function ThreadPreview(id, title, user, reply_num, comments_num, content, posted_time){
        var self = this;

        self._thread_id = id;
        self._title = ko.observable(title);
        self._submitter = ko.observable(user);
        self._replies = ko.observable(reply_num);
        self._comments = ko.observable(comments_num);
        self._link_address = ko.computed(function(){
            return "post/comments/"+self._thread_id;
        },self);
        self._post_time = new Date(posted_time);
        self._content = content;
        self.current_time = new Date();
        self._past_time = ko.computed (function(){
            return pastTime(self._post_time, self.current_time);
        })
        self.fromJSON = function(json){
            self._title = json.title;
            self._content = json.post_content;
            self._post_time = new Date(json.post_time);
        }
        self.getThread = function(){
            var getThread;
            $.ajax({
                url: url,
                method: "GET",
                data: getThread,
                dataType: 'json',
                success: function(data, textStatus, jqXHR){
                    alert("success");
                    //self = ko.fromJSON(data);
                    $('#products').replaceWith(data);
                }
            })

        }
    }


    function createThread(title, content, post_time, user){
        this.request = 'creat_new_thread',
            this.title = title,
            this.post_content = content;
        this.post_time = post_time;
        this.userid = user;
        this.post_type = 1;
    }

    var mininum_threads = 10;
    function info(command, num){
        this.Backend_commend = command;
        this.number = num;

    }

    function main_view(title, user, content, threads){
        var self = this;
        self.filter_choices = {
            HOSTEST: 1,
            LATEST: 2,
            REPLIED: 3,
            RECOMMENTED: 4}


        //track thread creation
        self._current_user = session_current_user;
        self._title = ko.observable(title);
        self._content = ko.observable(content);
        self._ThreadList = ko.observableArray(threads);
        self.canCreatePost = ko.computed(function(){return self._current_user!= "";})

        self.CreateThread = function(){
            var posted_time = new Date();
            var post_time_string = posted_time.toJSON();
            var creatThreadjson = new createThread(self._title(), self._content(), post_time_string, index._current_logined_user);
            console.log(ko.toJS(creatThreadjson));
            $.ajax({
                url: 'http://t5q583.koding.io:1991/ajax/createpost',
                method: "GET",
                data: ko.toJS(creatThreadjson),
                dataType: 'json',
                success: function(data, textStatus, jqXHR){
                    alert("success");
                    //self = ko.fromJSON(data);
                }
            })
        }

        self.getHottest = function(){
            //get hottest
            $("ul.filters > li").removeClass("active-filter");
            $("li#Hottest").addClass("active-filter");

            console.log(ko.toJSON(getHottest));

            $.ajax({
                url: 'http://t5q583.koding.io:1991/ajax/gethottestposts',
                method: "GET",
                crossDomain: true,
                data: getHottest,
                dataType: 'json',
                success: function(data){
                    //self=ko.fromJSON(data);
                    alert(ko.toJSON(data));
                    console.log(ko.toJSON(data));
                    self.fromJSON( ko.toJS(data) );
                },
            });

            var post_id_list = [];

        }

        self.getLatest = function(){
            //get lastest
            $("ul.filters > li").removeClass("active-filter");
            $("li#Lastest").addClass("active-filter");
            $.ajax({
                url: 'http://t5q583.koding.io:1991/ajax/getlattestposts',
                method: "GET",
                data: getLatest,
                dataType: 'json',
                success: function(data){
                    alert(ko.toJSON(data));
                    console.log("log_json");
                    self.fromJSON( ko.toJS(data) );
                }
            })
        }
        self.getUser_replied = function(){
            $("ul.filters > li").removeClass("active-filter");
            $("li#Replied").addClass("active-filter");
            $.ajax({
                url: 'http://t5q583.koding.io:1991/ajax/getposts',
                method: "GET",
                data: getUserReplied,
                dataType: 'jason',
                success: function(data){
                    self = ko.fromJSON(data);
                }
            })
        }

        self.getRecommended = function(){
            $("ul.filters > li").removeClass("active-filter");
            $("li#Recommended").addClass("active-filter");
            $.ajax({
                url: 'http://t5q583.koding.io:1991/ajax/getlattestposts',
                method: "GET",
                data: getLatest,
                dataType: 'json',
                success: function(data){
                    alert(ko.toJSON(data));
                    console.log("log_json");
                    self.fromJSON( ko.toJS(data) );
                }
            })
        }

        self.fromJSON = function(json){
            console.log("convert!");
            console.log(json);
            var threadlist =[];
            for(var i = 0; i < json.length; i++){
                console.log(json[0]);
                var thread_view = new ThreadPreview(json[i].postid, json[i].title, json[i].username, json[i].count, json[i].post_time, json[i].post_content, json[i].post_time);
                //thread_view.fromJSON(json[i]);
                threadlist.push(thread_view);
            }
            //console.log(threadlist);
            self._ThreadList(threadlist);
        }
    }

    function Thread_collection(Thread_list){
        var self = this;
        self._thread_array = Thread_list;
    }



    function AnimateRotate(angle) {
        // caching the object for performance reasons
        var $elem = $('.addThread');

        // we use a pseudo object for the animation
        // (starts from `0` to `angle`), you can name it as you want
        $({deg: 0}).animate({deg: angle}, {
            duration: 800,
            step: function(now) {
                // in the step-callback (that is fired each step of the animation),
                // you can use the `now` paramter which contains the current
                // animation-position (`0` up to `angle`)
                $elem.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            }
        });
    }


    $(document).ready(function(){
        var _isDisplay = 0;
        $(".createThread").hide();
        $(".createThread > *").hide();

        $("a.addThread").click(function(e){
            _isDisplay = 1 ^ _isDisplay;
            $(".createThread").animate({
                opacity: 1,
                width: "toggle",
                height: "toggle"
            }, 800, function() {
                // Animation complete.
            });
            $(".createThread > *").animate({
                opacity: "toggle"
            }, 800, function(){
            })

            if(_isDisplay)
                AnimateRotate(45);
            else
                AnimateRotate(0);



        })

        //knockout binding
        var thread = new ThreadPreview("News!", "john_smith", 0 , 0);
        var thread1 = new ThreadPreview("Other!", "Mary Smith", 0 , 0);
        var threadArray = [];
        threadArray.push(thread);
        threadArray.push(thread1);

        var main = new main_view("", "", "", threadArray);
        main.getHottest();

        ko.applyBindings(main, $("section#main_pade")[0]);
    });

}

var user_name = $("noscript#info").find("p#cuserid").text();

if(user_name == undefined){
    user_name = "";
}

index_showcase(user_name);