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

module.exports = router;