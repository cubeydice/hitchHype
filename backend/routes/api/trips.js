const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Trip = mongoose.model('Trip');
const { requireUser } = require('../../config/passport');
const validateTripInput = require('../../validations/trip');

const formatDate = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
}

// path = /trips
// Retrieve all trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find()
                                .populate("driver", "_id firstName lastName")
                                .populate("passenger", "_id firstName lastName")
                                .sort({ createdAt: -1 });
        const formattedTrips = trips.map((trip) => {
            return {
                ...trip.toObject(),
                departureDate: formatDate(departureDate)
            }
        })
        return res.json(formattedTrips);
    }
    catch(err) {
        return res.json([]);
    } 
});

// Retrieve user's trips
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
                                .populate("driver", "_id firstName lastName")
                                .populate('car', 'make model year' )
                                .populate("passengers.passenger", "_id firstName lastName");
        const formattedTrips = trips.map((trip) => {
            return {
                ...trip.toObject(),
                departureDate: formatDate(departureDate)
            }
        }) 
        return res.json(formattedTrips);
    }
    catch(err) {
        return res.json([]);
    }
})

// Retrieve individual trip
router.get('/:id', async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id)
                                .populate("driver", "_id firstName lastName")
                                .populate('car', 'make model year' )
                                .populate("passengers.passenger", "_id firstName lastName");
        const formattedTrip = {
            ...trip.toObject(),
            departureDate: formatDate(departureDate)
            }
        return res.json(formattedTrip);
    }
    catch(err) {
        const error = new Error('Trip not found');
        error.statusCode = 404;
        error.errors = { message: "No trip found with that id" };
        return next(error);
    }
});

// Create a trip
// Validation middleware should accept vehicle passenger limit as max
router.post('/', requireUser, validateTripInput, async (req, res, next) => {
    try {
        // Extract the required data from the request
        const { user, body } = req;
        const { car, departureDate, origin, destination, availableSeats } = body;

        const formarttedDepartureDate = formatDate(departureDate);

        const newTrip = new Trip({
            driver: user._id,
            car,
            passengers: [],
            departureDate: formarttedDepartureDate,
            origin,
            destination,
            availableSeats
        });
    
        let trip = await newTrip.save();
        trip = await trip.populate('driver', '_id firstName lastName')
                        .populate('car', 'make model year' )
                        .populate("passengers.passenger", "_id firstName lastName");
        return res.json(trip);
    }
    catch(err) {
        next(err);
    }
});

// Update a trip
router.patch('/:id', requireUser, validateTripInput, async (req, res, next) => {
    // Check if the trip exists
    try {
        // Find the trip by its ID
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            error.errors = { message: "No trip found with that id" };
            return next(error);
        }
        
        const { user, body } = req;

        // Check if the user is the driver of the trip
        if (trip.driver.toString() !== user._id.toString()) {
            const error = new Error('Unauthorized: You are not the driver of the trip');
            error.status = 403;
            error.errors = { message: 'You are not the driver of the trip' }
            return next(error);
        }
        
        // Extract the required data from the request
        const { car, passengers, departureDate, origin, destination, availableSeats } = body;
    
        const formarttedDepartureDate = formatDate(departureDate);

        // Update the trip with the new data
        trip.passengers = passengers;
        trip.car = car;
        trip.departureDate = formarttedDepartureDate;
        trip.origin = origin;
        trip.destination = destination;
        trip.availableSeats = availableSeats;

        // Save the updated trip
        let updatedTrip = await trip.save();
        updatedTrip = await trip.populate('driver', '_id firstName lastName')
                                .populate('car', 'make model year' )
                                .populate("passengers.passenger", "_id firstName lastName");
        res.json(updatedTrip);
    }
    catch(err) {
        next(err);
    }
});

// Remove trip
router.delete('/:id', requireUser, validateTripInput, async (req, res, next) => {
    try {
        // Find the trip by its ID
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            error.errors = { message: "No trip found with that id" };
            return next(error);
        }

        // Check if the user is the driver of the trip
        if (trip.driver.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized: You are not the driver of the trip');
            error.status = 403;
            error.errors = { message: 'You are not the driver of the trip' }
            return next(error);
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