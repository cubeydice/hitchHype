const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

// Custom validation function to check date format
const isvalidDate = (value) => {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Assuming MM-DD-YYYY
    return dateRegex.test(value);
}

const validateCarInput = [
    check('owner')
        .exists({ checkFalsy: true })
        .withMessage('Owner is required'),
    check('make')
        .exists({ checkFalsy: true })
        .withMessage('Make is required'),
    check('model')
        .exists({ checkFalsy: true })
        .withMessage('Model is required'),
    check('year')
        .exists({ checkFalsy: true })
        .withMessage('Year is required'),
    check('licensePlateNumber')
        .exists({ checkFalsy: true })
        .withMessage('License plate number is required'),
    check('insurance')
        .exists({ checkFalsy: true })
        .withMessage('Insurance is required'),
    check('mpg')
        .optional()
        .isNumeric()
        .withMessage('Miles per gallon (mpg) must be a number'),
    check('fueleconomyId')
        .optional()
        .isNumeric()
        .withMessage('Fuel economy ID must be a number'),
    handleValidationErrors
];

module.exports = validateCarInput;