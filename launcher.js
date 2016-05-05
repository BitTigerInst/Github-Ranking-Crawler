const Express = require('express');
const GithubCrawler = require('./crawl_github');

var app = Express();

app.get('/crawl', function (req, res) {
    GithubCrawler.crawl_github();
    res.send('Busy crawling our github...');
});

app.get('/', function (req, res) {
    res.send('Welcome to the BitTiger Github crawler!!');
});

app.listen(process.env.PORT || 5000, function () {
    console.log('App listening on port 4000!');
});