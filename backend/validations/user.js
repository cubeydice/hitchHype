const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateUserInput = [
    check('biography')
        .exists({ checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage('Password must not exceed 500 characters'),
    handleValidationErrors
];

module.exports = validateUserInput;