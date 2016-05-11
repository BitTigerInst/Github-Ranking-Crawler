const Express = require('express');
const GithubCrawler = require('./crawl_github');
const Utils = require('./helpers/my_utils');

var app = Express();
var port = process.env.PORT || 5000;

app.get('/crawl', function (req, res) {

    console.log('Received production request.');

    var current_timestamp_h = Utils.get_current_timestamp_h();
    // We set Heroku scheduler to update the ranking at 6:30am PDT, 
    // so we won't accept any request outside 6~7 am.
    if (current_timestamp_h == '6') {
        GithubCrawler.crawl_github(true);
        res.send('Busy crawling our github...');
    } else {
        console.log('Warning!! A mystery request is captured...');
        console.log(req.headers);
        res.send('迷の请求……');
    }
});

app.get('/test', function (req, res) {

    console.log('Received test request.');
    GithubCrawler.crawl_github(false);
    res.send('Busy crawling our github...');
});

app.get('/', function (req, res) {
    res.send('Welcome to the BitTiger Github crawler!!');
});

app.listen(port, function () {
    console.log('App listening on port ' + port + '!');
});