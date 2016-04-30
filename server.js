const request = require('request')
const json = require('json-promise');

var username = '';
var password = '';

var members_list=[]

var options = {
    url: 'https://api.github.com/orgs/bittigerInst/members', // URL to hit
    qs: { //Query string data
        page:2
    },
    method: 'GET', //Specify the method
    headers: { //Define headers
        'User-Agent': 'request'
    },
    auth: { //HTTP Authentication
        user: username,
        pass: password
    }
}

function callback(error, response, body) {

    json.parse(body)
        .then(function onParse(objs) {
            // do something with the data object

            console.log(objs);


            // console.log("The number of events is " + events.length);
            // for (i = 0; i < events.length; i++) {
            //     var event = events[i];
            //     //console.log(event.id);
            //     console.log(event.created_at);
            // }

        })
        .catch(function onParseError(e) {
            // the data is corrupted!
        });
}

request(options, callback);