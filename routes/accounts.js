
var Account = require('../models/account');
var utils = require('../lib/utils');
var constants = require('../lib/constants');


exports.register = function (req, res) {

    console.log('Register: ' + JSON.stringify(req.body));

    Account.findOne({ user_name: req.body.user_name }, function (err, data) {
        if (err) {
            res.json(err);
        }
        else if (data == null) {

            var _now = new Date();
            var _expires = _now.setDate(_now + 365);

            var account_data = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                user_name: req.body.user_name,
                password: utils.passwordHash(req.body.password),
                emails: [{ address: req.body.email, primary: true, created_at: _now, updated_at: _now }],
                created_at: _now,
                updated_at: _now,
                expires_at: _expires
                
            };

            var account = new Account(account_data);
               
                account.save(function (error, data) {
                    if (error) {
                        res.json(error);
                    }
                    else {                     
                        
                        res.send(200, { status: 200, message: 'account created successfully', account_id: data._id, data: data });

                    }
                });

        }
        else {
            res.send(400, { status: 400, message: 'Bad Request', errors: { user_name: ['has already been taken'] } });
        }
    });
};

exports.login = function (req, res) {

    Account.findOne({ user_name: req.body.user_name }, function (error, account) {
        if (error) {
            res.json(error);
        }
        else if (account == null) {
            res.send(401, { error: 'Unauthorized', message: 'invalid user name and/or password' });
        }
        else {
            if (account.password == utils.passwordHash(req.body.password)) {
                res.send(200, { status: 200, message: 'login successful'});
            }
            else {
                res.send(401, { error: 'Unauthorized', message: 'invalid user name and/or password' });
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
    //.select(scope)
    //.where('some_attribute').equals(req.params.some_value)
    .sort({last_name: 'asc', first_name: 'asc'})
    .exec(function (err, docs) {
        
        res.send(docs);

    });

};

//example request /v1/accounts/:id
exports.getById = function (req, res) {
    var id = req.params.id;
    console.log('Retrieving id: ' + id);

    Account.findById(id, function (err, account) {

        if (err) {
            res.send(500, { code: 500, error: err });
        }
        else if (account == null) {
            res.send(404, { code: 404, message: 'not found' });
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

    var id = req.params.id;
    var obj = req.body;

    var model = new Account(req.body);

    console.log('Updating password to ' + model.password + ' for ' + id);
    console.log(JSON.stringify(obj));


    Account.findById(id, function (err, account) {
        if (err) {

        }
        else {
            //allow specific properties to be updated
            account.password = model.password;
            account.updated_at = new Date();
            account.save(function (err, data) {
                if (err) {
                    res.json(err);
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
            res.send(500, { error: err });
        }
        else {
            res.send(200, { status: 200, message: 'delete successful' });
        }
    });

};


