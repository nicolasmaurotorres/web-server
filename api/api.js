var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var validator = require('validator');
var isEmpty = require('lodash/isEmpty');
var config = require('../config/config');
mongoose.connect(config.dbUri, { useMongoClient: true });
var models = require('./models')(mongoose);

module.exports.createUser = function (req, res) {
    const { errors, isValid } = validateInput(req.body);
    
    if (!isValid) {
        res.status(400).json(errors);
    } else {
        const _username = req.body.username;
        const _password = bcrypt.hashSync(req.body.password,10);
        const _email = req.body.email;
        const _timezone = req.body.timezone;
        var newUser = new models.Users({
            username: _username,
            password: _password,
            email: _email,
            timezone: _timezone
        });
        newUser.save(function (error) {
            if (error) {
                res.send(error);
            } else {
                res.status(200).json({ success: true });
            }
        });
    };
}

function validateInput (data) {
    let errors = {};

    if (validator.isEmpty(data.username)) {
        errors.username = 'this field is required';
    }

    if (validator.isEmpty(data.email)) {
        errors.email = 'this field is required';
    }

    if (!validator.isEmail(data.email)) {
        errors.email = 'email is invalid';
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'this field is required';
    }

    if (validator.isEmpty(data.passwordConfirmation)) {
        errors.passwordConfirmation = 'this field is required';
    }

    if (validator.isEmpty(data.timezone)) {
        errors.timezone = 'this field is required';
    }

    if (!validator.equals(data.password, data.passwordConfirmation)) {
        errors.passwordConfirmationMatch = 'passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}


