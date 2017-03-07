//authsession.js
"use strict";
let express = require('express'),
    app = express(),
    session = require('express-session');
let cookieParser = require('cookie-parser');
let path = require('path');
let util = require("util");

let instructions = `
Visit these urls in the browser:
<ul>
  <li> <a href="http://localhost:3000/content">localhost:3000/content</a> </li>
  <li> <a href="http://localhost:3000/content/chapter1.html">localhost:3000/content/chapter1.html</a> </li>
  <li> <a href="http://localhost:3000/login?username=juan&password=juanspassword">localhost:3000/login?username=juan&password=juanspassword</a> </li>
  <li> <a href="http://localhost:3000/login?username=amy&password=amyspassword">localhost:3000/login?username=amy&password=amyspassword</a> </li>
  <li> <a href="http://localhost:3000/logout">localhost:3000/logout</a> </li>
</ul>
`;

let layout = function(x) { return x+"<br />\n"+instructions; };

app.use(cookieParser());
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
 
app.use(function(req, res, next) {
  console.log("Cookies :  "+util.inspect(req.cookies));
  console.log("session :  "+util.inspect(req.session));
  next();
});

// Authentication and Authorization Middleware
let auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401); // https://httpstatuses.com/401
};
 
// Login endpoint
app.get('/login', function (req, res) {
  console.log(req.query);
  if (!req.query.username || !req.query.password) {
    console.log('login failed');
    res.send('login failed');    
  } else if(req.query.username === "amy" && req.query.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send(layout("login success!"));
  } else {
    console.log(`login ${util.inspect(req.query)} failed`);    
    res.send(layout(`login ${util.inspect(req.query)} failed`));    
  }
});
 
app.get('/', function(req, res) {
  res.send(instructions);
});
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send(layout("logout success!"));
});
 
// Get content endpoint
app.get('/content/*?', 
    auth  // next only if authenticated
);
 
app.use('/content', express.static(path.join(__dirname, 'public')));

app.listen(3000);
console.log("app running at http://localhost:3000");

