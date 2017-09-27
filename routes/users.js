var express = require('express');
var router = express.Router();
var validator = require('validator');
var isEmpty = require('lodash/isEmpty');

/* GET users listing. */
function validateInput(data){
  let errors = {};
 
  if (validator.isEmpty(data.username)){
    errors.username = 'this field is required';
  }

  if (validator.isEmpty(data.email)){
    errors.email = 'this field is required';
  }
  //console.log("pase2");
  if (!validator.isEmail(data.email)){
    errors.email = 'email is invalid';
  }

  if (validator.isEmpty(data.password)){
    errors.password = 'this field is required';
  }

  if (validator.isEmpty(data.passwordConfirmation)){
    errors.passwordConfirmation = 'this field is required';
  }

  if (validator.isEmpty(data.timezone)){
    errors.timezone = 'this field is required';
  }

  if(!validator.equals(data.password,data.passwordConfirmation)){
    errors.passwordConfirmation = 'passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

router.post('/', function(req, res, next) {
  const {errors, isValid} = validateInput(req.body);
  if (!isValid){
    res.status(400).json(errors);
  } else {
    res.status(200).json({success:true});
  }
});

module.exports = router;
