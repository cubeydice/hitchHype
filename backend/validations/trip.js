const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

// Custom validation function to check date format
const isvalidDate = (value) => {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Assuming MM-DD-YYYY
    return dateRegex.test(value);
}

const validateTripInput = [
    check('driver')
        .exists({ checkFalsy: true })
        .withMessage('Driver is required'),
    check('passengers')
        .isArray()
        .withMessage('Passengers must be an array'),
    check('departureTime')
        .exists({ checkFalsy: true })
        .withMessage('Date is required')
        .custom((value) => {
            if (!isvalidDate(value)) {
                throw new Error('Invalid date format');
            }
            return true;
        }),
    check('startPoint')
        .exists()
        .withMessage('Start point is required'),
    check('endPoint')
        .exists()
        .withMessage('End point is required'),
    check('availableSeats')
        .isInt({ min: 0 }) // max limit dependent on driver's vehicle
        .withMessage('Available seats must be a positive integer'),
    handleValidationErrors
];

module.exports = validateTripInput;