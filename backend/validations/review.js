const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateReviewInput = [
    check('reviewer')
        .exists({ checkFalsy: true })
        .withMessage('Reviewer is required'),
    check('reviewee')
        .exists({ checkFalsy: true })
        .withMessage('Reviewer is required'),
    check('rating')
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    check('title')
        .exists({ checkFalsy: true })
        .isLength({ min: 5, max: 100 })
        .withMessage('Title must be between 5 and 100 characters'),
    check('body')
        .exists({ checkFalsy: true })
        .isLength({ min: 50, max: 1000 })
        .withMessage('Title must be between 50 and 1,000 characters'),
    handleValidationErrors
];

module.exports = validateReviewInput;