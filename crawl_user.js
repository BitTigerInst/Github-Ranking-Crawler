const Account = require('./configs/account');
const Request = require('request');
const Promise = require('bluebird');
const Time = require('./time');

var username = Account.username;
var password = Account.password;

function crawl_user(user_id) {

    return function () {

        return new Promise(function (fulfill, reject) {
            console.log('user_id is ' + user_id);

            var current_date = Time.get_current_date();
            var last_week_date = Time.get_last_week_date();
            var user_info = {
                'User' : user_id,
                'Total': 0,
                'PushEvent': 0,
                'PullRequestEvent': 0,
                'CreateEvent': 0,
                'ForkEvent': 0
            }

            var funcs = Promise.resolve(make_range(10).map((n) => makeRequest(make_option(n, user_id))));
            funcs
                .mapSeries(iterator)
                .catch(function (err) {
                    console.log(err);
                })
                .finally(function () {
                    user_info['Total'] = user_info['PushEvent'] +
                        user_info['PullRequestEvent'] +
                        user_info['CreateEvent'] +
                        user_info['ForkEvent'];

                    //console.log(user_info);
                    console.log('Finished crawling: ' + user_id);

                    fulfill(user_info);
                })

            function makeRequest(option) {
                return function () {
                    return new Promise(function (fulfill, reject) {
                        Request(option, function (error, response, body) {
                            if (error) {
                                reject(error);
                            } else if (body.length == 0) {
                                reject('page empty');
                            } else {
                                console.log(body.length);
                                parseBody(body);
                                fulfill(body);
                            }
                        })
                    })
                };
            }

            function parseBody(body) {

                for (var i = 0; i < body.length; i++) {
                    event_type = body[i].type;
                    event_date = body[i].created_at;
                    
                    if (event_date > last_week_date && (
                        event_type == 'PushEvent' ||
                        event_type == 'PullRequestEvent' ||
                        event_type == 'CreateEvent' ||
                        event_type == 'ForkEvent')) {
                        
                        user_info[event_type]++;
                    }
                }
            }
        });
    };
}

function iterator(f) {
    return f()
}

function make_range(max_number) {
    var result = [];
    for (var i = 0; i < max_number; i++) {
        result.push(i);
    }
    return result;
}

function make_option(page_number, user_id) {
    return {
        url: 'https://api.github.com/users/' + user_id + '/events', // URL to hit
        qs: { //Query string data
            page: page_number
        },
        method: 'GET', //Specify the method
        headers: { //Define headers
            'User-Agent': 'request'
        },
        auth: { //HTTP Authentication
            user: username,
            pass: password
        },
        json: true
    };
}

exports.crawl_user = crawl_user;