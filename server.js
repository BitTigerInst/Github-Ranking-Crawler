const Account = require('./configs/account');
const User = require('./crawl_user');
const Request = require('request');
const Promise = require('bluebird');
const Fs = require('fs');
const Firebase = require('firebase');
const Time = require('./time');

var username = Account.username;
var password = Account.password;
var ref = new Firebase("https://bittiger-ranking.firebaseio.com/");
var user_events_ref = ref.child("user_events");

var github_info = {
    'members_list': [],
    'repository_list': []
}

var funcs = Promise.resolve(make_range(10).map((n) => makeRequest(make_option(n), 'members_list')));

funcs
    .mapSeries(iterator)
    .catch(function (err) {
        console.log(err);
    })
    .finally(function () {

        var members_list = github_info['members_list'];
        console.log(members_list.length);

        var user_events = [];
        for (var i = 0; i < members_list.length; ++i) {
            user_events.push(User.crawl_user(members_list[i]));
        }

        Promise.all(user_events).then(function (member_events) {
            promise_events_update = user_events_ref.child('events').set(member_events);
            promise_time_udpate =
                user_events_ref.child('created_time').set(Time.get_current_timestamp());

            Promise.all([promise_events_update, promise_time_udpate]).then(terminate_app)
        });
    })

function iterator(f) {
    return f()
}

function makeRequest(option, key) {
    return function () {
        return new Promise(function (fulfill, reject) {
            Request(option, function (error, response, body) {
                if (error) {
                    reject(error);
                } else if (body.length == 0) {
                    reject('page empty');
                } else {
                    console.log(body.length);
                    github_info[key] = github_info[key].concat(body);
                    fulfill(body);
                }
            })
        })
    };
}

function make_option(page_number) {
    return {
        url: 'https://api.github.com/orgs/bittigerInst/members', // URL to hit
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

function make_range(max_number) {
    var result = [];
    for (var i = 1; i <= max_number; i++) {
        result.push(i);
    }
    return result;
}

function terminate_app() {
    console.log("Done!!");
    process.exit();
}