const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Car = mongoose.model('Car');
const { requireUser } = require('../../config/passport');
const validateCarInput = require('../../validations/car');
const getVehicles = require('../../vehiclesParser');

// path = /cars
// Retrieve user's cars
router.get('/user/:userId', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            error.errors = { message: "No user found with that id" };
            return next(error);
        }

        // Check if the user is the user of cars
        if (req.user._id.toString() !== req.params.userId) {
            const error = new Error('Unauthorized: You can only access your own cars.');
            error.status = 403;
            error.errors = { message: 'You can only access your own cars.' }
            return next(error);
        }

        const cars = await Car.find({ owner: user._id })
                                .sort({ createdAt: -1 })
                                .populate("owner", "_id firstName lastName");
        return res.json(cars);
    }
    catch(err) {
        return res.json([]);
    }
});

//Fetch list of vehicles
router.get('/list', async (req, res) => {
    try {
        const vehiclesObj = await getVehicles();
        return res.json(vehiclesObj[0]);
    } catch(err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create a car
router.post('/', requireUser, validateCarInput, async (req, res, next) => {
    try {
        // Extract the required data from the request
        const { user, body } = req;
        const { make, model, year, maxPassengers, licensePlateNumber, insurance, mpg, fueleconomyId } = body;

        const newCar = new Car({
            owner: user._id,
            make,
            model,
            year,
            maxPassengers,
            licensePlateNumber,
            insurance,
            mpg,
            fueleconomyId
        });

        let car = await newCar.save();
        car = await car.populate('owner', '_id firstName lastName');
        return res.json(car);
    }
    catch(err) {
        next(err);
    }
});

// Update a car
router.patch('/:id', requireUser, validateCarInput, async (req, res, next) => {
    // Check if the car exists
    try {
        // Find the car by its ID
        const car = await Car.findById(req.params.id);

        if (!car) {
            const error = new Error('Car not found');
            error.status = 404;
            error.errors = { message: "No car found with that id" };
            return next(error);
        }

        const { user, body } = req;

        // Check if the user is the owner of the car
        if (car.owner.toString() !== user._id.toString()) {
            const error = new Error('Unauthorized: You are not the owner of the trip');
            error.status = 403;
            error.errors = { message: 'You are not the owner of the trip' }
            return next(error);
        }

        // Extract the required data from the request
        const { make, model, year, maxPassengers, licensePlateNumber, insurance, mpg, fueleconomyId } = body;

        // Update the car with the new data
        car.make = make;
        car.model = model;
        car.year = year;
        car.maxPassengers = maxPassengers,
        car.licensePlateNumber = licensePlateNumber;
        car.insurance = insurance;
        car.mpg = mpg;
        car.fueleconomyId = fueleconomyId;

        // Save the updated car
        const updatedCar = await car.save();

        res.json(updatedCar);
    }
    catch(err) {
        next(err);
    }
});

// Remove car
router.delete('/:id', requireUser, validateCarInput, async (req, res, next) => {
    try {
        // Find the car by its ID
        const car = await Car.findById(req.params.id);

        if (!car) {
            const error = new Error('Car not found');
            error.status = 404;
            error.errors = { message: "No car found with that id" };
            return next(error);
        }

        // Check if the user is the owner of the car
        if (car.owner.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized: You are not the owner of the car');
            error.status = 403;
            error.errors = { message: 'You are not the owner of the car' }
            return next(error);
        }

        // Remove the car from the database
        await car.remove();
        res.json({ message: 'Car deleted successfully' });
    }
    catch(err) {
        next(err);
    }
});

module.exports = router;