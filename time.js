const Moment = require('moment-timezone');

function get_current_timestamp() {

    return Moment().tz("America/Los_Angeles").format();
}

function get_current_date() {

    return Moment().tz("America/Los_Angeles").format();
}


function get_last_week_date() {

    return Moment().subtract(7, 'd').tz("America/Los_Angeles").format();
}

exports.get_current_date = get_current_date;
exports.get_last_week_date = get_last_week_date;