const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateUserInput = [
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('First name must not exceed 50 characters'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage('Last name must not exceed 50 characters'),
    check('phoneNumber')
        .exists({ checkFalsy: true })
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 digits'),
    check('biography')
        .exists({ checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage('Password must not exceed 500 characters'),
    handleValidationErrors
];

module.exports = validateUserInput;