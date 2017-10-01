var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var validator = require('validator');
var isEmpty = require('lodash/isEmpty');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
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
        
        models.Users.findOne({email : _email}, function(err0, res0){
            if (res0){
                // el email es repitido, lo agrego a los errores, checkeo si el nombre es repitido
                errors.email = 'email repetido';
            }
            models.Users.findOne({username : _username}, function(err1,res1){
                if (res1){
                    //nombre de usuario repetido, lo agrego a los errores
                    errors.username = 'nombre de usuario repetido';
                }
                newUser.save(function (err2) {
                    if (err2) {
                        res.status(400).json(errors);
                    } else {
                        res.status(200).json({ success: true });
                    }
                });
            });
        });
    };
}

module.exports.checkUniqueUserOrEmail = function(req,res){
    const _identifier = req.params.identifier;
    debugger;
    models.Users.find({$or:[ {'username': _identifier}, {'email': _identifier}]} , function(err,user) {
        var errors = {};
        debugger;
        if (user.length > 0) {     
            errors.repeated = 'ya hay un usuario con dicho';
            res.status(200).json({errors});
        } else {
        res.status(200).json({success:false});
        }
    });
}

module.exports.authenticateUser = function (req,res){
    debugger;
    const { identifier, password } = req.body;   
    models.Users.findOne({$or:[ {'username': identifier}, {'email': identifier}]}, function(err,user){
        var errors = {};
        debugger;
        if (user) {     
            if (bcrypt.compareSync(password, user.get('password'))){
               const token = jwt.sign({
                   id: user.get('id'),
                   username:user.get('username')
               },config.jwtSecret); 
               res.json({token});
            } else {
                res.status(401).json({errors: {form : 'invalid credentials'}});
            }
        } else {
            res.status(401).json({errors: {form : 'invalid credentials'}});
        }
    })
}

module.exports.createEvent = function(req,res){
    // MOCK data
    res.status(201).json({ success : true });
}

module.exports.authenticate = function (req, res, next) {
    debugger;
    const authorizationHeader = req.headers['authorization'];
    let token;

    if (authorizationHeader) {
        token = authorizationHeader.split(' ')[1];
    }

    if (token) {
        jwt.verify(token, config.jwtSecret, function (err, decoded) {
            if (err) {
                res.status(401).json({ error: 'failed to authenticated' });
            } else {
                debugger;
                
                models.Users.findOne({ username : decoded.username },function (err,user) {
                    debugger;
                    if (!user){
                        res.status(404).json({error : 'no such user'});
                    }
                    req.currentUser = {username: user.username, timezone: user.timezone};
                    next();
                });    
            }
        });
    } else {
        res.status(403).json({
            error: 'no token provided'
        });
    }
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


