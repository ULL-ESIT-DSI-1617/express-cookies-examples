* Estas notas están tomadas de este [blog](http://www.codexpedia.com/node-js/a-very-basic-session-auth-in-node-js-with-express-js/)
* [express-session en GitHub](https://github.com/expressjs/session)

* Authentication is the process of verifying if the user is in fact who he/she is declared to be. 
* Authorization is the process of determining if the user has the privileges to access the resources he/she requested.

This node.js code snippet demonstrated a very simple example of authentication and authorization process using session in express.js. 

There is 
* a login endpoint, 
* a logout endpoint and 
* get post page. 

To see the post page, you have to login first, and your identity will be verified and saved in session. 

When you hit the logout endpoint, it will revoke your access by removing your identity from the session.
session_auth.js

```javascript
var express = require('express'),
    app = express(),
    session = require('express-session');

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
 
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
```

To run the above code from command line

```shell
npm install --save express
npm install --save express-session
node authsession.js
```

Visit these urls in a browser

```shell
localhost:3000/content
localhost:3000/login?username=amy&password=amyspassword
localhost:3000/content
localhost:3000/logout
localhost:3000/content
```

## Code explanation

Import express and express-session modules. Create express app and add session to express app as a middleware.

```javascript
var express = require('express'),
    app = express(),
    session = require('express-session');

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
```

Authentication and authorization middleware function. Grant the next step if the user is amy and if she has the admin access. The values to check against is hardcoded for demonstration purpose. A real web app will get the user and user access level from session, and then check against the user and user access lever from a database on the server.

```javascript
// Authentication and Authorization Middleware
var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};
```

`localhost:3000/login?username=amy&password=amyspassword`, the login url to check log the user in by saving the user and user access level in a session. The session will be different for each user, and also be unique for the same user using different browsers. For example, if the same user logged in using Chrome, and the open up Firefox, the user will have to login again in FireFox in order to gain protected resources. For demonstration purpose, this is a get request and passing in the info through query parameters. A real web app will usually be using a post request and passing in the data in the post form. Again the user and passwords are hardcoded here for demonstration purpose. A real web app will check the incoming user and password against the user and password stored in a database on there server.

```javascript
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
```
localhost:3000/logout, logout by destroy the session. Once the session is destroyed, the user will have to hit the login url again in order to gain protected resources.

```javascript
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!");
});
```
localhost:3000/content, get the protected contents. The auth function above is passed in the second parameters as a middleware before it proceed to serve the content to the user. If the auth function determined the user is not valid, it will not proceed to the thrid function to serve the content.

```javascript
// Get content endpoint
app.get('/content', auth, function (req, res) {
    res.send("You can only see this after you've logged in.");
});
```
Lastly, start the app by listening on port 3000.

```javascript
app.listen(3000);
console.log("app running at http://localhost:3000");
```
