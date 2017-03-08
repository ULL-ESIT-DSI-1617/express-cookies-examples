var express = require('express');

var port = 8999;

var app = express();

function checkAuth (req, res, next) {
	console.log('checkAuth ' + req.url);

	// don't serve /secure to those not logged in
	// you should add to this list, for each and every secure url
	if (req.url === '/secure' && (!req.session || !req.session.authenticated)) {
		res.render('unauthorised', { status: 403 });
		return;
	}

	next();
}

var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session');
app.use(session({
    secret: 'example',
    resave: true,
    saveUninitialized: true
}));
 
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var flash = require('express-flash');
app.use(flash());

app.use(checkAuth);
//	app.use(app.router);
app.set('view engine', 'pug');
app.set('view options', { layout: false });

require('./lib/routes.js')(app);

app.listen(port);
console.log('Node listening on port %s', port);
