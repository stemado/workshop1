

var express = require('express');
var db = require('./config/database');
var accounts = require('./routes/accounts');

var app = express();

//this allows req.body to be parsed 
app.use(express.bodyParser());

//declare this static directory for serving public pages, styles, scripts, images, etc.
app.use(express.static(__dirname + '/public'));

console.log(process.env.NODE_ENV);
console.log(app.settings.env)

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
    res.sendfile('public/accounts-api.html');
});

//**************************************************************************************
//* REST API routes
//**************************************************************************************
app.post('/v1/accounts/register', accounts.register);
app.post('/v1/accounts/login', accounts.login);
//account CRUD routes
app.get('/v1/accounts', accounts.getAll);
app.get('/v1/accounts/:id', accounts.getById);
//app.post('/v1/accounts', accounts.add);
app.put('/v1/accounts/:id', accounts.update);
app.delete('/v1/accounts/:id', accounts.delete);



var port = process.env.PORT || 3000; // Use the port that Heroku provides or default to 5000
app.listen(port, function () {
    //console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    console.log("Express server listening on port " + port);
});



