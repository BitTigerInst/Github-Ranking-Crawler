const Express = require('express');
const GithubCrawler = require('./crawl_github');

var app = Express();
var port = process.env.PORT || 5000;

app.get('/crawl', function (req, res) {
    console.log('Received request:');
    //console.log(req.headers);
    GithubCrawler.crawl_github();
    res.send('Busy crawling our github...');
});

app.get('/', function (req, res) {
    res.send('Welcome to the BitTiger Github crawler!!');
});

app.listen(port, function () {
    console.log('App listening on port ' + port + '!');
});