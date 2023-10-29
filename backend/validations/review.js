const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateReviewInput = [
    check('reviewer')
        .exists({ checkFalsy: true })
        .withMessage('Reviewer is required'),
    check('reviewee')
        .exists({ checkFalsy: true })
        .withMessage('Reviewer is required'),
    handleValidationErrors
];

module.exports = validateReviewInput;