var express = require('express');
var router = express.Router({caseSensitive: true});

	router.get('/login', function (req, res, next) {
		res.render('login', { flash: req.flash() } );
	});

	router.post('/login', function (req, res, next) {

		// you might like to do a database look-up or something more scalable here
		if (req.body.username && req.body.username === 'user' && req.body.password && req.body.password === 'pass') {
			req.session.authenticated = true;
			res.redirect('/secure');
		} else {
			req.flash('error', 'Username and password are incorrect');
			res.redirect('/login');
		}

	});

	router.get('/logout', function (req, res, next) {
		delete req.session.authenticated;
		res.redirect('/');
	});

module.exports = router;
