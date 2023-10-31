const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

// Custom validation function to check phone number format
const isPhoneNumberValid = (value) => {
    const phoneNumberRegex = /^(?:\+\d{1,2}\s?)?(?:(?:\(\d{3}\))|(?:\d{3}))[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneNumberRegex.test(value);
};

// validateLoginInput is a combination Express middleware that uses the `check`
// middleware to validate the keys in the body of a request to login a user
const validateLoginInput = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Email is invalid'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6, max: 30 })
        .withMessage('Password must be between 6 and 30 characters'),
        check('firstName')
        .exists({ checkFalsy: true })
        .withMessage('First name is required'),
    check('lastName')
        .exists({ checkFalsy: true })
        .withMessage('Last name is required'),
    check('phoneNumber')
        .exists({ checkFalsy: true })
        .withMessage('Phone number is required')
        .custom((value) => {
            if (!isPhoneNumberRegex(value)) {
                throw new Error('Invalid phone number format');
            }
            return true;
        })
        .withMessage('Invalid phone number format')
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone number must be 10 digits'),
    handleValidationErrors
];

module.exports = validateLoginInput;