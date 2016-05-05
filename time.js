const Moment = require('moment-timezone');

function get_current_timestamp() {

    return Moment().tz("America/Los_Angeles").format();
}

function get_current_date() {

    var now = new Date();
    // The Heroku server is running in UTC+0. We adjust  the time zone to UTC-7.
    new.setDate(new.getHours() - 7);

    return now.getFullYear() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
}


function get_last_week_date() {

    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    // The Heroku server is running in UTC+0. We adjust  the time zone to UTC-7.
    oneWeekAgo.setDate(oneWeekAgo.getHours() - 7);

    return oneWeekAgo.getFullYear() + "-" + ("0" + (oneWeekAgo.getMonth() + 1)).slice(-2) + "-" + ("0" + oneWeekAgo.getDate()).slice(-2);


    //    var newDate = new Date();
    //    newDate.setTime(unixtime * 1000);
    //    dateString = newDate.toUTCString();

}

exports.get_current_timestamp = get_current_timestamp;
exports.get_current_date = get_current_date;
exports.get_last_week_date = get_last_week_date;