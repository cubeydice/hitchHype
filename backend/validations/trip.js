const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

// Custom validation function to check date format
const isValidDate = (value) => {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/; // Assuming MM-DD-YYYY
    return dateRegex.test(value);
}

// Custom validation function to limit max available seats to car passenger limit
const validateAvailableSeats = (value, { req }) => {
    const maxPassengers = req.car.maxPassengers; // Assuming you've passed the car object in the request
    if (value > maxPassengers) {
        throw new Error(`Available seats cannot exceed ${maxPassengers}`);
    }
    return true;
}

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
    check('passengers.passenger')
        .exists({ checkFalsy: true })
        .withMessage('Passenger is required'),
    check('passengers.dropoffPoint')
        .exists({ checkFalsy: true })
        .withMessage('Drop-off point is required'),
    check('departureDate')
        .exists({ checkFalsy: true })
        .withMessage('Date is required')
        .custom((value) => {
            if (!isValidDate(value)) {
                throw new Error('Invalid date format');
            }
            return true;
        }),
    check('origin.street')
        .exists({ checkFalsy: true })
        .withMessage('Start point street is required'),
    check('origin.city')
        .exists({ checkFalsy: true })
        .withMessage('Start point city is required'),
    check('origin.state')
        .exists({ checkFalsy: true })
        .withMessage('Start point state is required'),
    check('origin.postalCode')
        .exists({ checkFalsy: true })
        .withMessage('Start point postal code is required'),
    check('destination.street')
        .exists({ checkFalsy: true })
        .withMessage('End point street is required'),
    check('destination.city')
        .exists({ checkFalsy: true })
        .withMessage('End point city is required'),
    check('destination.state')
        .exists({ checkFalsy: true })
        .withMessage('End point state is required'),
    check('destination.postalCode')
        .exists({ checkFalsy: true })
        .withMessage('End point postal code is required'),
    check('availableSeats')
        .isInt({ min: 0 }) // max limit dependent on driver's vehicle
        .withMessage('Available seats must be a positive integer')
        .custom(validateAvailableSeats),
    handleValidationErrors
];

module.exports = validateTripInput;