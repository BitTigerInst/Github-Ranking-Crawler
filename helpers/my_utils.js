const Moment = require('moment-timezone');

function get_current_timestamp_h() {

    return Moment().tz("America/Los_Angeles").format('h');
}

function get_current_timestamp() {

    return Moment().tz("America/Los_Angeles").format();
}

function get_last_week_timestamp() {

    return Moment().subtract(7, 'd').tz("America/Los_Angeles").format();
}

function make_range(start, end) {
    var result = [];
    for (var i = start; i <= end; i++) {
        result.push(i);
    }
    return result;
}

exports.get_current_timestamp_h = get_current_timestamp_h;
exports.get_current_timestamp = get_current_timestamp;
exports.get_last_week_timestamp = get_last_week_timestamp;
exports.make_range = make_range;