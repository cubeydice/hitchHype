const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Car = mongoose.model('Car');
const { requireUser } = require('../../config/passport');
const validateCarInput = require('../../validations/car');
const path = require('path');
const fs = require('fs');

// path = /api/cars
// Retrieve user's cars

// Create a car
router.post('/', requireUser, validateCarInput, async (req, res, next) => {
    try {
        // Extract the required data from the request
        const { user, body } = req;
        const { make, model, year, licensePlateNumber, insurance, mpg, fueleconomyId } = body;

        const newCar = new Car({
            owner: user._id,
            make,
            model,
            year,
            licensePlateNumber,
            insurance,
            mpg,
            fueleconomyId
        });

        let car = await newCar.save();
        car = await car.populate('owner', '_id firstName lastName');

        user.car = newCar._id;
        user.save();

        return res.json(car);
    }
    catch(err) {
        next(err);
    }
});

router.get('/user/:carId', async (req, res, next) => {
    try {
        const cars = await Car.find({ _id: req.params.carId })
        return res.json(cars);
    }
    catch(err) {
        return res.json([]);
    }
});

//Fetch list of vehicles
router.get('/list', async (req, res) => {
    const vehiclePath = path.join(__dirname, '../../public/vehicles/vehicle-list.json')

    fs.readFile(vehiclePath, 'utf8', (err, data) => {
        try {
            const vehicleData = JSON.parse(data)
            res.json(vehicleData)
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })
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
        const { make, model, year, licensePlateNumber, insurance, mpg, fueleconomyId } = body;

        // Update the car with the new data
        car.make = make;
        car.model = model;
        car.year = year;
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
router.delete('/:id', requireUser, async (req, res, next) => {
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

        //Remove car from user
        req.user.car = null;
        req.user.save();

        // Remove the car from the database
        await car.deleteOne();
        res.json({ message: 'Car deleted successfully' });
    }
    catch(err) {
        next(err);
    }
});

module.exports = router;