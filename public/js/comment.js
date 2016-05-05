var Thread = function(session_current_user, seesion_post_id){
    //var thread_parent = this;
    //thread_parent._current_logined_user = current_user;
    //thread_parent.post_id = post_id;
    this.get_current_user = function(){
        return thread_parent._current_logined_user;};
    function ThreadViewJsonTemplate(id, title, content, comment_list, likes, post_time){
        this.postid = id;
        this.title = title;
        this.content = content;
        this.comment_list = comment_list;
        this.likes = likes;
        this.post_time = post_time;
    }
//sample json
    function commentJSONTemplate(id, entry, user, post_time){
        this.commentid = id;
        this.comment_content = entry;
        this.userid = user;
        this.post_time = post_time;
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


    function request_Thread_JSON(thread_id){
        this.request = "get_Thread_by_id",
            this.postid = thread_id
    }

    var sortbycomments = function(left, right){
        return left._comment_list().length == right._comment_list().length ? 0 : (left._comment_list().length < right._comment_list().length ? -1 : 1);
    };

    var sortbyscore = function(left, right){
        return left._likes == right._likes ? 0 : (left._likes < right._likes ? -1 : 1);
    };

    var sortbytime = function(left, right){
            return left._posted_time == right._posted_time ? 0 : (left._posted_time < right._posted_time ? -1 : 1);
        }

        -

//


        function user_info_viewmodel(user_name){
            this._current_user = user_name;
        }

    function comment_viewmodel(thread_id,user_id, user_image, like, saved, edit, entry, parent, thread, posted_time){
        var self = this;
        self._id;
        self._current_user = session_current_user;
        self._user_name = ko.observable(user_id);
        self._user_image_url = ko.observable(user_image);
        self._like = ko.observable(like);
        self._entry = ko.observable(entry);
        self._entry_cache = ko.observable("");
        self._parent = parent;
        self._thread = thread;
        self._reply_list = ko.observableArray([]);
        //this._reply_num = ko.observable(ko.computed(function(){ return this._reply_list().length;}));
        self._isedited= ko.observable(false);
        self._editable =  ko.computed(function(){ return self._current_user == self._user_name();});
        self._posted_time = new Date(posted_time);
        self._comment_list = ko.observableArray();
        self._current_time = new Date();
        //this._time_past = pastTime(posted_time, this._current_time);
        self._past_time = ko.computed(function(){
            return pastTime(self._posted_time, self._current_time);
        });
        self.upvote = function(){
            self._like(self._like() + 1);
        };
        self.downvote = function(){
            self._like(self._like() - 1)
        };
        self.edit_comment = function(item, event){
            self._entry_cache(self._entry());
            var ele = event.target;
            if(!$(ele).hasClass("edit_button")){
                ele = $(ele).parent()[0];
            }
            //console.log(ele);
            var parent = $(ele).parent().parent();
            $(ele).parent().toggle();
            parent.find(".edit-view").toggle();
        };
        self.submit_edition = function(item, event){
            self._entry(self._entry_cache());
            var ele = event.target;
            var parent = $(ele).parent().parent().parent();
            parent.find(".comment-view").toggle();
            parent.find(".edit-view").toggle();
        };
        self.cancelsubmit = function(item, event){
            var ele = event.target;
            var parent = $(ele).parent().parent().parent();
            parent.find(".comment-view").toggle();
            parent.find(".edit-view").toggle();
        };
    };

    function thread_viewmodel(user_name, user_image, like, entry, comment_list, filter, order, json, voted_users, posted_time){
        var self = this;
        self.AUTHORIZTION_TYPE = ["Guest", "Author", "User"];
        self._id = 0;
        self.model = function(){ this._user = "some one";}
        self._current_user = session_current_user;
        self._user_name = ko.observable(user_name);
        self._user_image_url = ko.observable(user_image);
        self._likes = ko.observable(like);
        self._vote_by = ko.observableArray(voted_users);
        self._title = ko.observable("");
        self._entry = ko.observable(entry);

        self._comment_list = ko.observableArray(comment_list);
        self._authorization;
        self._filter = filter;
        self._order = order;
        self._current_time;
        self._posted_time = new Date(posted_time);
        self._past_time = ko.computed(function(){
            //return pastTime(self._posted_time, self._current_time);
        })
        self.canCreatePost = ko.computed(function(){return self._current_user!= "";})
        self._voted_user = ko.observableArray();
        //self._canVote = ko.computed(function(){ return (self._voted_user.find(self._user_name) ==undefined);});
        self.is_deletable = ko.computed(function(){
            return self._current_user == self._user_name;
        })

        //
        self._current_reply = ko.observable("");

        self._json = json;

        self.updateBackend = function(reply_content){
            //var updatedJSON = ko.mapping.toJSON(self);
            console.log("new content");
            console.log(reply_content);
            var threadjson =self.toJSON();
            $.ajax({
                type: "POST",
                url: 'http://t5q583.koding.io:1991/ajax/updatecomment',
                data: reply_content,
                success: function(data){
                    //alert(ko.toJSON(data));
                    //self.fromJSON(data)
                    console.log("success");
                },
                dataType: 'json'
            });

        }

        self.reply2Thread = function(){
            var replay_date = new Date();
            var replay_date_string;
            var reply_content = self._current_reply();
            console.log(reply_content);
            var current_time = new Date();
            var comment_id = Math.floor(10000 + Math.random() * 1000);
            var reply = new comment_viewmodel(comment_id, self._current_user, undefined, 0, false, false, reply_content, false, this, current_time);
            self._comment_list.push(reply);
            self._current_reply("");

            var reply_json = new commentJSONTemplate(comment_id, reply_content, self._current_user, ko.toJSON(current_time));

            self.updateBackend(reply_json);
        };
        /*
         self.reply2comment = function(comment){
         var replay_date = new Date();
         var replay_date_string;
         var reply_content;
         var reply = new comment_viewmodel;
         self._comment_list.push(self._current_user, undefined, 0, false, false, false, reply_content);
         // self.updateBackend();
         };
         */
        self.upvote = function(){
            self._likes(self._likes()+1);

            //self.updateBackend();
        };

        self.downvote = function(){
            self._likes(self._likes()-1);

            //self.updateBackend();
        };

        self.resetReply = function(){
            //
            self._current_reply("");

            //self.updateBackend();
        };

        self.reverseSort = function(){
            self._comment_list.reverse();

            //self.updateBackend();
        };
        self.deleteComment = function(item){
            //console.log(item);
            var entry = item._entry();
            console.log(entry);
            self._comment_list.remove(function(item){
                return item._entry() == entry;
            });
            //self._comment_list.removeAll();

            //self.updateBackend();
        };

        self.testLoadJSON = function(threadid){
            var result;
            var request = new request_Thread_JSON(seesion_post_id);
            console.log(ko.toJSON(request));

            $.ajax({
                type: "GET",
                url: 'http://t5q583.koding.io:1991/ajax/getpostGT',
                data: request,
                success: function(data){
                    //self = ko.mapping.fromJSON(data);
                    //alert(ko.toJSON(data));
                    self.threadfromJSON(data);
                },
                dataType: 'json'
            });

            $.ajax({
                type: "GET",
                url: 'http://t5q583.koding.io:1991/ajax/getcommentsbypostGT',
                data: request,
                success: function(data){
                    //self = ko.mapping.fromJSON(data);
                    //alert(ko.toJSON(data));
                    self.commentsfromJSON(data);
                },
                dataType: 'json'
            });
        };
        //sorting
        self.sortByTime = function(){
            self._comment_list.sort(sortbytime);
        };
        self.sortByScore = function(){
            console.log("sort");
            //self._comment_list.sort(sortbyscore);
            self._comment_list.sort( function(left, right){ return left._like == right._like ? 0 : (left._like < right._like ? -1 : 1);});

        };
        self.toJSON = function(){
            var comment_list_cache = [];
            for(var i = 0; i < self._comment_list.length; i++){
                var comment_temp = new commentJSONTemplate(self._comment_list[i]._id, self._comment_list[i]._entry, self._comment_list[i]._user_name, self._comment_list[i]._posted_time);
                comment_list_cache.push(comment_temp);
            }

            var Threadjson = new ThreadViewJsonTemplate(self._id, self._title, self._entry, comment_list_cache, self._likes());
            return Threadjson;
        }
        self.threadfromJSON = function(thread_json){
            console.log("convert!");
            //console.log(thread_json[0].postid);
            //self._id = thread_json[0].postid;
            self._title(thread_json[0].title);
            self._entry(thread_json[0].post_content);
            self._user_name(thread_json[0].username)
            self._likes(thread_json[0].likes);
            self._post_time = new Date(thread_json[0].comment_time);
            self._user_image_url(thread_json[0].user_avatar);
        }
        self.commentsfromJSON = function(comments_json){

            //construct comments
            var comment_list_cache = [];
            var count = Object.keys(comments_json).length;
            for(var i = 0; i < count; i++){
                var comment_cache = new comment_viewmodel(comments_json[i].commentid, comments_json[i].username, comments_json[i].user_avatar, comments_json[i].count, 0, false, comments_json[i].comment_content, undefined,  comments_json[i].username, comments_json[i].comment_time);
                comment_list_cache.push(comment_cache);
            }
            self._comment_list(comment_list_cache);
        }
    }



//functions


    $(document).ready(function(){

        function toggleSortingOrder(icon){
            if(icon.hasClass("fa-sort-amount-desc")){
                icon.removeClass("fa-sort-amount-desc");
                icon.addClass("fa-sort-amount-asc");
            }
            else{
                icon.removeClass("fa-sort-amount-asc");
                icon.addClass("fa-sort-amount-desc");
            }
        }


        $("a#filter").click(function(){
            $(".filter-types").toggle();
        });

        $("a#sort").click(function(){
            $(".sort-types").toggle();
        });

        $("a#sort-order").click(function(){
            toggleSortingOrder($("a#sort-order > i"));
        });

        $("button.edit_button").click(function(){
            console.log("toggle!");
            $(".comment-view").toggle();
            $(".edit-view").toggle();
        });

        $("button.submit_change").click(function(){
            $(".comment-view").css("display", "block");
            $(".edit-view").css("display", "none");
        });

        $("ul.filter-types").toggle();
        $("ul.sort-types").toggle();


        var comment_list = [];
        var comment1 = new comment_viewmodel(11110,"mary Sue",undefined, 0, false, false, "hahaha");
        var comment2 = new comment_viewmodel(1111,"John Doe",undefined, 1, false, false, "Any way");
        comment_list.push(comment1);
        comment_list.push(comment2);

        var cur_thread = new thread_viewmodel("Joe_Doe",undefined, 0, "anything\n to now",comment_list, false, false, undefined);

        ko.applyBindings(cur_thread, $(".Thread_View")[0]);

        var testJSON = ko.toJSON(cur_thread);
        //console.log(testJSON);
        cur_thread.testLoadJSON();

        var date1 = new Date();

        var date2 = new Date("May 2, 2016, 00:00:00 UTC");

        var past_time = pastTime(date2, date1);
        console.log(past_time);
    });

}


$(document).ready(function(){
    
    var user_name_1 = $('noscript#cuserid').text();
var post_id_1 = $('noscript#cpostid').text();
if(user_name_1 === undefined){
    user_name_1 = "";
}

Thread(user_name_1, post_id_1);
});


//console.log("Thread JS loaded!");