const request = require('request')
//const json = require('json-promise');
const Promise = require('bluebird');

var username = 'BitTigerDashBoardAgent';
var password = 'bittiger2016';

var members_list = []

function make_option(page_number) {
	return {
		url: 'https://api.github.com/orgs/bittigerInst/members', // URL to hit
		qs: { //Query string data
			page: page_number
		}
		, method: 'GET', //Specify the method
		headers: { //Define headers
			'User-Agent': 'request'
		}
		, auth: { //HTTP Authentication
			user: username
			, pass: password
		}
		, json: true
	};
}

var funcs = Promise.resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => makeRequest(n)));

funcs
	.mapSeries(iterator)
	.catch(function (err) {
		console.log(err);
	})
	.finally(function () {
		//console.log(members_list);

		for (var i = 0; i < members_list.length; i++) {
			console.log(members_list[i].login);
		}

		console.log('Done!');
	})

function iterator(f) {
	return f()
}

function makeRequest(page_num) {
	return function () {
		return new Promise(function (fulfill, reject) {
			request(make_option(page_num), function (error, response, body) {
				if (error || body.length == 0) {
					reject('Rejected by Cosmo.' + page_num);
				} else {
					console.log(body.length);
					members_list = members_list.concat(body);
					fulfill(body);
				}
			})
		})
	};
}