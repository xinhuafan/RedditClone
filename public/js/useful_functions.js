var util_functions = function(){
    var self = this;
    self.past_time = function(old_time, current_time){
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
}