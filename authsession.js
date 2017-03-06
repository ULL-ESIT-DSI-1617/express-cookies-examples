var express = require('express'),
    app = express(),
    session = require('express-session');
var util = require("util");

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
 
app.use('*', function(req, res, next) {
  console.log("Cookies :  "+util.inspect(req.cookies));
  console.log('Request cookies:', req.cookies); 
  next();
});

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};
 
// Login endpoint
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed');    
  } else if(req.query.username === "amy" || req.query.password === "amyspassword") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success!");
  }
});
 
app.get('/', function(req, res) {
  res.send(`
    Visit these urls in the browser:
    <ul>
      <li> <a href="http://localhost:3000/content">localhost:3000/content</a> </li>
      <li> <a href="http://localhost:3000/login?username=amy&password=amyspassword">localhost:3000/login?username=amy&password=amyspassword</a> </li>
      <li> <a href="http://localhost:3000/content">localhost:3000/content</a> </li>
      <li> <a href="http://localhost:3000/logout">localhost:3000/logout</a> </li>
      <li> <a href="http://localhost:3000/content">localhost:3000/content</a> </li>
    </ul>
  `);
});
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
 
// Get content endpoint
app.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});
 
app.listen(3000);
console.log("app running at http://localhost:3000");

