const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

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
        .withMessage('Year is required')
        .isLength({ min: 4, max: 4 }) 
        .withMessage('Year must be a 4-digit number'),
    check('licensePlateNumber')
        .exists({ checkFalsy: true })
        .withMessage('License plate number is required'),
    check('insurance')
        .exists({ checkFalsy: true })
        .withMessage('Insurance is required'),
    check('mpg')
        .optional()
        .isInt()
        .withMessage('Miles per gallon (mpg) must be a integer'),
    check('fueleconomyId')
        .optional()
        .isInt()
        .withMessage('Fuel economy ID must be a integer'),
    handleValidationErrors
];

module.exports = validateCarInput;