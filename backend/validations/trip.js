const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateTweetInput = [
    check('driver')
        .exists({ checkFalsy: true })
        .withMessage('Driver is required'),
    check('passengers')
        .isArray()
        .withMessage('Passengers must be an array'),
    check('startPoint')
        .exists()
        .withMessage('Start point is required'),
    check('endPoint')
        .exists()
        .withMessage('End point is required'),
    check('passengerLimit')
        .isInt({ min: 1 }) // max limit dependent on driver's vehicle
        .withMessage('Passenger limit must be a positive integer'),
    handleValidationErrors
];

module.exports = validateTweetInput;