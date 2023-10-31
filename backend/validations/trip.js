const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateTripInput = [
    check('driver')
        .exists({ checkFalsy: true })
        .withMessage('Driver is required'),
    check('car')
        .exists({ checkFalsy: true })
        .withMessage('Car is required'),
    check('passengers')
        .isArray()
        .withMessage('Passengers must be an array'),
    (req, res, next) => {
        if (req.body.passengers && req.body.passengers.length > 0) {
            for (let i = 0; i < req.body.passengers.length; i++) {
                check(`passengers[${i}].passenger`)
                    .exists({ checkFalsy: true });
                check(`passengers[${i}].dropoffPoint`)
                    .exists({ checkFalsy: true });
            }
        }
        next();
    },
    check('departureDate')
        .exists({ checkFalsy: true })
        .withMessage('Date is required'),
    check('origin')
        .exists({ checkFalsy: true })
        .withMessage('Origin is required'),
    check('destination')
        .exists({ checkFalsy: true })
        .withMessage('Destination is required'),
    check('availableSeats')
        .isInt({ min: 0 }) 
        .withMessage('Available seats must be a positive integer'),
    check('distance')
        .isInt({ min: 0 }) 
        .withMessage('Distance must be a positive integer'),
    handleValidationErrors
];

module.exports = validateTripInput;