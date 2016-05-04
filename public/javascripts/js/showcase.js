/**
 * Created by Qiushuo on 4/22/2016.
 */
var index_showcase = function(){
    var thread_load_num =10

    var getHottest = {
        request: "get_Hottest_threads",
        num: thread_load_num
    }

    var getLatest = {
        request: "get_Latest_threads",
        num: thread_load_num
    }

    var getUserReplied = {
        request: "get_User_replied",
        num: thread_load_num
    }


    function createThread(title, content){
        var json ="\
    {\
      request: 'creat_new_thread',\
      title: '"+title+"',\
      content: '"+content+"'\
    }\
    ";
        return json;
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
        self.current_choice = self.filter_choices.HOSTEST;


        //track thread creation
        self._title = ko.observable(title);
        self._content = ko.observable(content);
        self._ThreadList = ko.observableArray(threads);

        self.CreateThread = function(){

        }

        self.getHottest = function(){
            //get hottest
            $("ul.filters > li").removeClass("active-filter");
            $("li#Hottest").addClass("active-filter");

            $.ajax({
                url: 'http:t5q583.koding.io:1991/ajax/getpost',
                method: "GET",
                data: {'postid':25},
                dataType: 'jason',
                success: function(data){
                    alert(JSON.stringify(data));
                }
            })
        }

        self.getLatest = function(){
            //get lastest
            console.log("get lattest");
            $("ul.filters > li").removeClass("active-filter");
            $("li#Lastest").addClass("active-filter");
            $.ajax({
                url: url,
                method: "GET",
                data: ko.toJSON(getLatest),
                dataType: 'jason',
                success: function(data){
                    self = ko.fromJSON(data);
                }
            })
        }
        self.getUser_replied = function(){
            $("ul.filters > li").removeClass("active-filter");
            $("li#Replied").addClass("active-filter");
            $.ajax({
                url: url,
                method: "GET",
                data: ko.toJSON(getUserReplied),
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

        self.testgetJquery = function(url){
            $.getJSON(url, function(data){
                self = ko.fromJSON(data);
            })
        }
    }

    function Thread_collection(Thread_list){
        var self = this;
        self._thread_array = Thread_list;
    }

    function ThreadPreview(title, user, reply_num, comments_num){
        var self = this;

        self._thread_id;
        self._title = ko.observable(title);
        self._submitter = ko.observable(user);
        self._replies = ko.observable(reply_num);
        self._comments = ko.observable(comments_num);
        self._link_address = ko.computed(function(){
            return "/comments?id="+self._thread_id;
        },self)
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
        var threadArray = [];
        threadArray.push(thread);

        var main = new main_view("", "", "", threadArray);

        ko.applyBindings(main, $("section#main_pade")[0]);
    });

}
index_showcase();
