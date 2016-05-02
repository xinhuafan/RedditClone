//sample json
var thread_sample = {
    current_user: "not_john_smith",
    thread: {
        user_name: "john smith",
        submit_time: 10,
        score: 10,
        content: "You know, whatever that is ?"
    },
    comment_block:
        [
            {
                user_name: "amy doe",
                submit_time: 20,
                score: 1,
                content: "Good"
            },
            {
                user_name: "amy doe",
                submit_time: 20,
                score: 1,
                content: "Good"
            }
        ]
};

var sortbycomments = function(left, right){
    return left._comment_list().length == right._comment_list().length ? 0 : (left._comment_list().length < right._comment_list().length ? -1 : 1);
};

var sortbyscore = function(left, right){
    return left._likes == right._likes ? 0 : (left._likes < right._likes ? -1 : 1);
};

function pastTime(old_time, current_time){
    var time_last ={
        "second" : " seconds ago",
        "minute" : " mintes ago",
        "hour": " hours ago",
        "day": " days ago",
        "month": "monthes ago",
        "year": "years ago",
        "second-offset": 6,
        "mintes-offset": 5
    };

    var result;

    if(old_time.getFullYear()!= current_time.getFullYear()){
        var year_differ = current_time.getFullYear() - old_time.getFullYear();
        result = year_differ + time_last.year;
    }
    if(old_time.getMonth()!=current_time.getMonth()){
        var month_differ = current_time.getMonth() - old_time.getMonth();  
        result = month_differ + time_last.month;
    }
    if(old_time.getDay()!=current_time.getDay()){
        var day_differ = current_time.getDay()- old_time.getDay();
        result = day_differ + time_last.day;
    }
    if(old_time.getHours()!=current_time.getHours()){
        var hour_differ = current_time.getHours() - old_time.getHours();
        result = hour_differ + time_last.hour;
    }
    if(old_time.getMinutes()!=current_time.getMinutes()){
        var minutes_differ = current_time.getMinutes() - old_time.getMinutes();
        result = minutes_differ + time_last.mintues;
    }

    return result;
}

//


function user_info_viewmodel(user_name){
    this._current_user = user_name;
}

function thread_viewmodel(user_name, user_image, like, entry, comment_list, filter, order, json){
    var self = this;
    self.AUTHORIZTION_TYPE = ["Guest", "Author", "User"];
    self._id;
    self._current_user = "Jack";
    self._user_name = user_name;
    self._user_image_url = user_image;
    self._likes = ko.observable(like);
    self._entry = ko.observable(entry);
    self._comment_list = ko.observableArray(comment_list);
    self._authorization;
    self._filter = filter;
    self._order = order;
    self._posted_time;
    self._voted_user = ko.observableArray();

    //
    self._current_reply = ko.observable("");

    self._json = json;

    self.reply2Thread = function(){
        var replay_date = new Date();
        var replay_date_string;
        var reply_content = this._current_reply();
        console.log(reply_content);
        var current_time = new Date();
        var reply = new comment_viewmodel(this._current_user, undefined, 0, false, false, reply_content, false, this, current_time)
        self._comment_list.push(reply);
    };

    self.reply2comment = function(comment){
        var replay_date = new Date();
        var replay_date_string;
        var reply_content;
        var reply = new comment_viewmodel
        self._comment_list.push(this._current_user, undefined, 0, false, false, false, reply_content);
    };

    self.upvote = function(){
        self._likes(self._likes()+1);
    };

    self.downvote = function(){
        self._likes(self._likes()-1);
    };

    self.resetReply = function(){
        //
        self._current_reply("");
    };

    self.reverseSort = function(){
        self._comment_list.reverse();
    };
    self.deleteComment = function(item){ 
        //console.log(item);
        var entry = item.entry();
        console.log(entry);
        self._comment_list.remove(function(item){
            return item.entry() == entry;
        });
        //self._comment_list.removeAll();
    }
}


function comment_viewmodel(user_id, user_image, like, saved, edit, entry, parent, thread, posted_time){
    this._id;
    this._user_name = ko.observable(user_id);
    this._user_image = user_image;
    this._like = ko.observable(like);
    this.entry = ko.observable(entry);
    this._parent = parent;
    this._thread = thread;
    this._reply_num = ko.observable(0);
    this._reply_list = [];
    this._isediting = ko.observable(false);
    this._posted_time = posted_time;
    this._comment_list = ko.observableArray();
    this._current_time = new Date();
    //this._time_past = pastTime(posted_time, this._current_time);

};
comment_viewmodel.prototype = {
    upvote: function(){
        this._like(this._like() + 1);
    },
    downvote: function(){
        this._like(this._like() - 1)
    },
    deleteComment: function(item){
        this.comment_list.remove(item);
    }
}

//ko.applyBindings(new comment_model("john smith", "none", 2, false, false, "something you know"));



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

$("a#sort-order").click(function(){
    toggleSortingOrder($("a#sort-order > i"));
})



//functions
function like(item, model){
    item.css("color","red");

}

function update(message){

}




$(document).ready(function(){
    
    $("button.edit_button").click(function(){
    $(".comment-view").css("display", "none");
    $(".edit-view").css("display", "flex");
})

$("button.submit_change").click(function(){
    $(".comment-view").css("display", "block");
    $(".edit-view").css("display", "none");
})
    
    $("a#filter").click(function(){
    $(".filter-types").toggle();
})

$("a#sort").click(function(){
    $(".sort-types").toggle();
})
    
    var comment_list = [];
    var comment1 = new comment_viewmodel("mary Sue",undefined, 0, false, false, "hahaha");
    var comment2 = new comment_viewmodel("John Doe",undefined, 1, false, false, "Any way");
    comment_list.push(comment1);
    comment_list.push(comment2);

    var cur_thread = new thread_viewmodel("Joe_Doe",undefined, 0, "anything",comment_list, false, false, undefined);

    ko.applyBindings(cur_thread);
});