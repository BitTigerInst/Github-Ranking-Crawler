const Account = require('./configs/account');
const Request = require('request');
const Promise = require('bluebird');
const Utils = require('./helpers/my_utils');

var username = Account.username;
var password = Account.password;
var current_date = Utils.get_current_timestamp();
var last_week_date = Utils.get_last_week_timestamp();
console.log('**** The current date on server is ' + current_date);
console.log('**** The last week date on server is ' + last_week_date);

function crawl_user(user) {

    return new Promise(function (fulfill, reject) {
        console.log('user_id is ' + user.login);

        var user_info = {
            'login': user.login,
            'avatar_url': user.avatar_url,
            'html_url': user.html_url,
            'organization': user.organization,
            'Total': 0,
            'PushEvent': 0,
            'PullRequestEvent': 0,
            'CreateEvent': 0,
            'ForkEvent': 0
        }

        var funcs = Promise.resolve(Utils.make_range(1, 10).map((n) => makeRequest(make_option(n, user.login))));
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
                console.log('Finished crawling: ' + user.login);

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
                            //console.log(body.length);
                            var should_continue = parseBody(body);
                            if (should_continue) {
                                fulfill(body);
                            } else {
                                reject('outdated events');
                            }
                        }
                    })
                })
            };
        }

        function parseBody(body) {

            var should_continue = true;
            if (body[0].created_at < last_week_date) {
                should_continue = false;
            } else {

                for (var i = 0; i < body.length; i++) {
                    event_type = body[i].type;
                    event_date = body[i].created_at;

                    if (event_date >= last_week_date && (
                            event_type == 'PushEvent' ||
                            event_type == 'PullRequestEvent' ||
                            event_type == 'CreateEvent' ||
                            event_type == 'ForkEvent')) {

                        user_info[event_type]++;
                    }
                }
            }
            return should_continue;
        }
    });
}

function iterator(f) {
    return f()
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