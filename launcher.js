const Express = require('express');
const cronJob = require('cron').CronJob;
const common = require('common');
const GithubCrawler = require('./crawl_github');
var cronJobs = {};

var collectGithubData = function (callback) {

    console.log("==== Collecting github data.");
    GithubCrawler.crawl_github();
    console.log("==== Finished collecting github data.");
}

//remember to add 'time' dependency in package.json if you want to 'timeZone' feature
var jobs = [
    {
        name: 'Collect Github Data',
        //cronTime: '0 2 0 * * *', // every day at 00:02:00 am (extra 2 minutes for dyno wakeup, any number between 0 and 60 minutes is fine as cronjob will be guaranteed to be executed before dyno went sleep again)
        cronTime: '*/60 * * * * *', // every 10 seconds
        onTick: collectGithubData,
        start: true,
        id: 'collect_github_data_1',
        timeZone: 'America/Los_Angeles'
  }
];


// Start here ....
var app = Express();

jobs.map(function (job) {
    cronJobs[job.id] = new cronJob(job);
    console.log(job.name + " -- " + job.cronTime + " -- " + job.timeZone);
});


app.get('/crawl', function (req, res) {
    GithubCrawler.crawl_github();
    res.send('Hello World!');
});

app.listen(4000, function () {
    console.log('Example app listening on port 4000!');
});