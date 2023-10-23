const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Trip = mongoose.model('Trip');
const { requireUser } = require('../../config/passport');
const validateTripInput = require('../../validations/trip');

// retrieve all trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find()
                                .populate("driver", "_id firstName lastName")
                                .sort({ createdAt: -1 });
        return res.json(trips);
    }
    catch(err) {
        return res.json([]);
    } 
});

// retrieve a single user's trips
router.get('/user/:userId', async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.userId);
    } catch(err) {
        const error = new Error('User not found');
        error.statusCode = 404;
        error.errors = { message: "No user found with that id" };
        return next(error);
    }
    try {
        const trips = await Trip.find({ driver: user._id })
                                .sort({ createdAt: -1 })
                                .populate("driver", "_id firstName lastName");
        return res.json(trips);
    }
    catch(err) {
        return res.json([]);
    }
})

// retrieve individual trip
router.get('/:id', async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id)
                                .populate("drive", "_id firstName lastName");
        return res.json(trip);
    }
    catch(err) {
        const error = new Error('Trip not found');
        error.statusCode = 404;
        error.errors = { message: "No trip found with that id" };
        return next(error);
    }
});

// create a trip
// validation middleware should accept user.cars.passengerLimit
router.post('/', requireUser, validateTripInput, async (req, res, next) => {
    try {
        // Extract the required data from the request
        const { user, body } = req;
        const { startPoint, endPoint, passengerLimit } = body;

        const newTrip = new Trip({
            driver: user._id,
            passengers: [],
            startPoint,
            endPoint,
            passengerLimit
        });
    
        let trip = await newTrip.save();
        trip = await trip.populate('driver', '_id firstName lastName');
        return res.json(trip);
    }
    catch(err) {
        next(err);
    }
});

// update a trip
router.patch('/:id', requireUser, validateTripInput, async (req, res, next) => {
    // Check if the trip exists
    try {

        // Find the trip by its ID
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            error.errors = { message: "No trip found with that id" };
            throw error;
        }
        
        const { user, body } = req;

        // Check if the user is the driver of the trip
        if (trip.driver.toString() !== user._id.toString()) {
            const error = new Error('Unauthorized: You are not the driver of the trip');
            error.status = 403;
            error.errors = { message: 'You are not the driver of the trip' }
            throw error;
        }
        
        // Extract the required data from the request
        const { passengers, startPoint, endPoint, passengerLimit } = body;
    
        // Update the trip with the new data
        trip.passengers = passengers;
        trip.startPoint = startPoint;
        trip.endPoint = endPoint;
        trip.passengerLimit = passengerLimit;

        // Save the updated trip
        const updatedTrip = await trip.save();

        res.json(updatedTrip);
    }
    catch(err) {
        next(err);
    }
});

// remove trip
router.delete('/:id', requireUser, validateTripInput, async (req, res, next) => {
    try {
        // Find the trip by its ID
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            error.errors = { message: "No trip found with that id" };
            throw error;
        }

        // Check if the user is the driver of the trip
        if (trip.driver.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized: You are not the driver of the trip');
            error.status = 403;
            error.errors = { message: 'You are not the driver of the trip' }
            throw error;
        }

        // Remove the trip from the database
        await trip.remove();
        res.json({ message: 'Trip deleted successfully' });
    }
    catch(err) {
        next(err);
    }
});

module.exports = router;