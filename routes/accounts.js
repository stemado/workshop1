
var Account = require('../models/account');
var utils = require('../lib/utils');
var constants = require('../lib/constants');


exports.register = function (req, res) {

    console.log('Register: ' + JSON.stringify(req.body));

    Account.findOne({ user_name: req.body.user_name }, function (err, data) {
        if (err) {
            res.json(500, { status: 500, message: "Error", error: err });
        }
        else if (data != null ) {
            res.send(400, { status: 400, message: 'Bad Request', errors: { user_name: ['has already been taken'] } });
        }
        else if (data == null) {

            var _now = new Date();

            console.log("_now: " + _now);

            var account_data = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                user_name: req.body.user_name,
                password: utils.passwordHash(req.body.password),
                emails: [{ address: req.body.email, primary: true, created_at: _now, updated_at: _now }],
                created_at: _now,
                updated_at: _now
                
            };

            var account = new Account(account_data);
               
                account.save(function (err, data) {
                    if (err) {
                        res.send(500, { status: 500, message: "Error", error: err } );
                    }
                    else {                     
                        
                        res.send(200, { status: 200, message: 'account created successfully', access_token: "coming soon..." });

                    }
                });

        }

    });
};

exports.login = function (req, res) {

    console.log('Login: ' + JSON.stringify(req.body));

    Account.findOne({ user_name: req.body.user_name }, function (err, account) {
        if (err) {
            res.send(500, { status: 500, message: "Error", error: err } );
        }
        else if (account == null) {
            //res.send(404, { status: 404, message: 'Not Found', details: 'account not found for user name' });
            //lets not reveal whether or not an account exists in our system for a specific user name
            res.send(401, { status: 401, message: 'Unauthorized', details: 'invalid user name and/or password' });
        }
        else {
            if (account.password == utils.passwordHash(req.body.password)) {
                res.send(200, { status: 200, message: 'login successful', access_token: "coming soon..." });
            }
            else {
                res.send(401, { status: 401, message: 'Unauthorized', details: 'invalid user name and/or password' });
            }
        }
    });

};

//wouldn't normally expose this method, but allows us to try out the GET method
exports.getAll = function (req, res) {

    //get the documents using skip and offset (this doesn't allow for TOTAL count to be determined)
    Account.find(function (err, data) {
    })
    //.skip(offset)
    //.limit(count)
    .select('_id user_name first_name last_name emails._id emails.address emails.primary')
    //.where('some_attribute').equals(req.params.some_value)
    .sort({last_name: 'asc', first_name: 'asc'})
    .exec(function (err, docs) {
        
        res.send(docs);

    });

};

//example request /v1/accounts/:id
exports.getById = function (req, res) {

    console.log('Retrieving id: ' + req.params.id);

    Account.findById(req.params.id, function (err, account) {

        if (err) {
            res.send(500, { status: 500, message: "Error", error: err } );
        }
        else if (account == null) {
            res.send(404, { status: 404, message: 'not found' });
        }
        else {
            res.send(account);
        }
    });

};

//this isn't really used since exports.register is serving the same function
/*
exports.add = function (req, res) {
    var obj = req.body;
    console.log('Adding: ' + JSON.stringify(obj));
    //this is handled by exports.register
};
*/

exports.update = function (req, res) {

    console.log("Updating: " + JSON.stringify(req.body));

    Account.findById(req.params.id, function (err, account) {
        if (err) {
            res.send(500, { status: 500, message: "Error", error: err } );
        }
        else {

            var _now = new Date();

            //allow specific properties to be updated
            account.first_name = req.body.first_name;
            account.last_name = req.body.last_name;
            account.emails[0].address = req.body.email;
            account.emails[0].updated_at = _now;
            account.password = utils.passwordHash(req.body.password);
            account.updated_at = _now;
            account.save(function (err, data) {
                if (err) {
                    res.send(500, { status: 500, message: "Error", error: err } );
                }
                else {

                    res.send(200, { status: 200, message: 'update successful' });

                }
            });
        }

    });

};

exports.delete = function (req, res) {

    console.log('Deleting: ' + req.params.id);

    Account.remove({ _id: req.params.id }, function (err) {

        console.log('err: ' + err);

        if (err) {
            res.send(500, { status: 500, message: "Error", error: err } );
        }
        else {
            res.send(200, { status: 200, message: 'delete successful' });
        }
    });

};


