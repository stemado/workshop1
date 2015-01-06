

var express = require('express');
var bodyParser = require('body-parser');
var db = require('./config/database');
var accounts = require('./routes/accounts');

var app = express();

//this allows req.body to be parsed by our API
app.use(bodyParser.urlencoded({ extended: false }))
//this instructs our API to support application/json as the content type
app.use(bodyParser.json())

//declare this static directory for serving public pages, styles, scripts, images, etc.
app.use(express.static(__dirname + '/public'));


//**************************************************************************************
//* page routes
//**************************************************************************************
app.get('/', function (req, res) {
    res.render('index.html');
});
app.get('/register', function (req, res) {
    res.sendfile('public/register.html');
});
app.get('/login', function (req, res) {
    res.sendfile('public/login.html');
});
app.get('/api-demo', function (req, res) {
    res.sendfile('public/api-demo.html');
});

//**************************************************************************************
//* REST API routes
//**************************************************************************************
app.post('/api/v1/accounts/register', accounts.register);
app.post('/api/v1/accounts/login', accounts.login);
//account CRUD routes
app.get('/api/v1/accounts', accounts.getAll);
app.get('/api/v1/accounts/:id', accounts.getById);
//app.post('/api/v1/accounts', accounts.add); //this is addressed by /accounts/register
app.put('/api/v1/accounts/:id', accounts.update);
app.delete('/api/v1/accounts/:id', accounts.delete);


//**************************************************************************************
//* Start our app
//**************************************************************************************
var port = process.env.PORT || 3000; // Use the port that Heroku provides or default to 3000 locally
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});



