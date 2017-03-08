var express = require('express');
var router = express.Router({caseSensitive: true});

	router.get('/', function (req, res, next) {
		res.render('index');
	}); 

	router.get('/welcome', function (req, res, next) {
		res.render('welcome');
	});

	router.get('/secure', function (req, res, next) {
		res.render('secure');
	});


module.exports = router;
