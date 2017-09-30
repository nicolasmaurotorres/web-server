import Validator from 'validator';
import isEmpty from 'lodash/isEmpty';

export default function validateInput(data){
    let errors = {};

    if (Validator.isEmpty(data.identifier)){
        errors.identifier = 'this field is required';
    }

    if (Validator.isEmpty(data.password)){
        errors.password = 'this field is required';
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }
}
