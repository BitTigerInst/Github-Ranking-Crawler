const Account = require('./configs/account');
const User = require('./crawl_user');
const Request = require('request');
const Promise = require('bluebird');
const Fs = require('fs');
const Firebase = require('firebase');
const Time = require('./time');
const HolyShit = require('./top_coders');

var username = Account.username;
var password = Account.password;
var ref = new Firebase("https://bittiger-ranking.firebaseio.com/");
var user_events_ref = ref.child("user_events");

var crawl_github = function () {

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

            var user_events = [];

            // Crawl BitTiger members
            var members_list = github_info['members_list'];
            for (var i = 0; i < members_list.length; ++i) {
                members_list[i]['organization'] = 'bittiger';
                user_events.push(User.crawl_user(members_list[i]));
            }

            // Crawl top coders
            for (var i = 0; i < HolyShit.top_coders.length; i++) {
                user_events.push(User.crawl_user(HolyShit.top_coders[i]));
            }

            Promise.all(user_events)
                .catch(function (err) {
                    console.log(err);
                })
                .then(function (member_events) {

                    member_events.sort(function (a, b) {
                        return b['Total'] - a['Total']
                    });

                    top25_members = member_events.slice(0, 25);
                    console.log('Updating the database...');
                    promise_events_update = user_events_ref.child('events').set(top25_members);
                    promise_time_udpate =
                        user_events_ref.child('created_time').set(Time.get_current_date());

                    Promise.all([promise_events_update, promise_time_udpate])
                        .catch(function (err) {
                            console.log(err);
                        })
                        .finally(terminate_app)
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
                        //console.log(body.length);
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
        //process.exit();
    }
}

exports.crawl_github = crawl_github;