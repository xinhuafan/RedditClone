/**
 * Created by Qiushuo on 5/4/2016.
 */
var index_showcase = function(){
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

        -



        function ThreadPreview(id, title, user, reply_num, comments_num, content, posted_time){
            var self = this;

            self._thread_id = id;
            self._title = ko.observable(title);
            self._submitter = ko.observable(user);
            self._replies = ko.observable(reply_num);
            self._comments = ko.observable(comments_num);
            self._link_address = ko.computed(function(){
                return "/post?id="+self._thread_id;
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
        self._title = ko.observable(title);
        self._content = ko.observable(content);
        self._ThreadList = ko.observableArray(threads);

        self.CreateThread = function(){
            var posted_time = new Date();
            var post_time_string = posted_time.toJSON();
            var creatThreadjson = new createThread(self._title(), self._content(), post_time_string, 12);
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
            $.ajax({
                type: "GET",
                url: 'http://t5q583.koding.io:1991/ajax/getcommentsbypostGT',
                data: ko.toJS(creatThreadjson),
                success: function(data){
                    //self = ko.mapping.fromJSON(data);
                    alert(ko.toJSON(data));
                    self.commentsfromJSON(data);
                },
                dataType: 'json'
            });
        }



        self.getHottest = function(){
            //get hottest
            $("ul.filters > li").removeClass("active-filter");
            $("li#Hottest").addClass("active-filter");

            console.log(ko.toJSON(getHottest));

            $.ajax({
                url: 'http://t5q583.koding.io:1991/ajax/getposts',
                method: "GET",
                crossDomain: true,
                data: getHottest,
                dataType: 'json',
                success: function(data){
                    //self=ko.fromJSON(data);
                    //alert(ko.toJSON(data));
                    console.log(ko.toJSON(data));
                    self.fromJSON( ko.toJS(data) );
                },
            })
        }

        self.getLatest = function(){
            //get lastest
            $("ul.filters > li").removeClass("active-filter");
            $("li#Lastest").addClass("active-filter");
            $.ajax({
                url: 'http://t5q583.koding.io:1991/ajax/getposts',
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
        }

        self.fromJSON = function(json){
            console.log("convert!");
            console.log(json);
            var threadlist =[];
            for(var i = 0; i < json.length; i++){
                console.log(json[0]);
                var thread_view = new ThreadPreview(json[i].postid, json[i].title, json[i].username, 0, json[i].post_time, json[i].post_content, json[i].post_time);
                //thread_view.fromJSON(json[i]);
                threadlist.push(thread_view);
            }
            //console.log(threadlist);
            self._ThreadList(threadlist);
        }

        self.setReplyNumbers = function(data){

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
index_showcase();