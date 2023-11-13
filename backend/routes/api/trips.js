const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
// const parserAddress = require('parse-address-string');
const User = mongoose.model("User");
const Trip = mongoose.model("Trip");
const Review = mongoose.model("Review");
const Car = mongoose.model("Car");
const { requireUser } = require("../../config/passport");
const validateTripInput = require("../../validations/trip");

// path = /trips
// Retrieve all trips
router.get("/", async (req, res) => {
    try {
        const trips = await Trip.find()
                                .populate("driver", "_id firstName lastName")
                                .populate("car", "make model year licensePlateNumber insurance mpg fueleconomyId" )
                                .populate("passengers.passenger", "_id firstName lastName")
                                .sort({ createdAt: -1 });
        const currentTrips = trips.filter(trip => new Date(trip.departureDate) >= new Date())
        return res.json(currentTrips);
    }
    catch(err) {
        return res.json([]);
    } 
});


// Retrieve all trips origins and destinations
router.get("/places", async (req, res) => {
    try {
        const trips = await Trip.find()
        const tripsPlaces = trips.map( trip => [trip.origin, trip.destination])
        return res.json(tripsPlaces);
    }
    catch(err) {
        return res.json([]);
    } 
});

// Retrieve passenger's rides
router.get("/user/:userId/rides", async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.userId);
    } catch(err) {
        const error = new Error("User not found");
        error.statusCode = 404;
        error.errors = { message: "No user found with that id" };
        return next(error);
    }
    try {
        const rides = await Trip.find({ "passengers.passenger": user._id })
                                .sort({ createdAt: -1 })
                                .populate("driver", "_id firstName lastName profilePicture phoneNumber")
                                .populate("car", "make model year licensePlateNumber insurance mpg fueleconomyId" )
                                .populate("passengers.passenger", "_id firstName lastName profilePicture phoneNumber");
        return res.json(rides);
    } catch(err) {
        return res.json([]);
    }
})

// Retrieve driver's trips
router.get("/user/:userId", async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.userId);
    } catch(err) {
        const error = new Error("User not found");
        error.statusCode = 404;
        error.errors = { message: "No user found with that id" };
        return next(error);
    }
    try {
        const trips = await Trip.find({ driver: user._id })
                                .sort({ createdAt: -1 })
                                .populate("driver", "_id firstName lastName profilePicture phoneNumber")
                                .populate("car", "make model year licensePlateNumber insurance mpg fueleconomyId" )
                                .populate("passengers.passenger", "_id firstName lastName profilePicture phoneNumber");
        return res.json(trips);
    }
    catch(err) {
        return res.json([]);
    }
})

// Retrieve individual trip
router.get("/:id", async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id)
                                .populate("driver", "_id firstName lastName biography profilePicture phoneNumber")
                                .populate("car", "make model year licensePlateNumber insurance mpg fueleconomyId" )
                                .populate("passengers.passenger", "_id firstName lastName profilePicture phoneNumber");
        
        const reviewee = await Review.find({reviewee: trip.driver._id})
        let ratingTotal = 0;
        let avgRating = 0;
        if (reviewee.length > 0) {
            for (const review of reviewee) {
                ratingTotal += review.rating
            }
            avgRating = ratingTotal / reviewee.length
        }

        const newTrip = { ...trip.toObject() };
        newTrip.driver.avgRating = avgRating;
        return res.json(newTrip);
    }
    catch(err) {
        const error = new Error("Trip not found");
        error.statusCode = 404;
        error.errors = { message: "No trip found with that id" };
        return next(error);
    }
});

// Create a trip
// API did not have vehicle max passenger, therefore limitation validation is removed
router.post("/", requireUser, validateTripInput, async (req, res, next) => {
    try {
        // Extract the required data from the request
        const { user, body } = req;
        const { car, departureDate, origin, destination, availableSeats, distance } = body;

        // Check if date is in the past
        if (new Date(departureDate) < new Date()) {
            const error = new Error("Cannot enter past date");
            error.statusCode = 400;
            error.errors = { message: "You are not a time traveler" };
            return next(error);
        }

        const newTrip = new Trip({
            driver: user._id,
            car,
            passengers: [],
            departureDate,
            origin,
            destination,
            availableSeats,
            distance
        });
    
        const trip = await newTrip.save();
        const populatedTrip = await Trip.populate(trip, [
            { path: "driver", select: "_id firstName lastName profilePicture phoneNumber" },
            { path: "car", select: "make model year licensePlateNumber insurance mpg fueleconomyId" },
        ]);
        return res.json(populatedTrip);
    }
    catch(err) {
        next(err);
    }
});

// Update a trip
// API did not have vehicle max passenger, therefore limitation validation is removed
router.patch('/:id', requireUser, validateTripInput, async (req, res, next) => {
    // Check if the trip exists
    try {
        // Find the trip by its ID
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            const error = new Error("Trip not found");
            error.status = 404;
            error.errors = { message: "No trip found with that id" };
            return next(error);
        }
        
    const { user, body } = req;

        // Check if the user is the driver or passenger of the trip
        // if (trip.driver._id.toString() !== user._id.toString() &&
        // trip.passengers.every(passenger => passenger.passenger._id.toString() !== user._id.toString())) {
        //     const error = new Error("Unauthorized: You are not the driver nor passenger of the trip");
        //     error.status = 403;
        //     error.errors = { message: "You are not the driver nor passenger of the trip" }
        //     return next(error);
        // }
        
        // Extract the required data from the request
        const { car, passengers, departureDate, origin, destination, availableSeats, distance } = body;

        // Check if passenger exceeds available seats
        if (passengers.length > availableSeats) {
            const error = new Error("Passengers cannot exceed available seats");
            error.status = 400;
            error.errors = { message: "Passengers cannot exceed available seats" }
            return next(error);
        }

        // Check if date is in the past
        if (new Date(departureDate) < new Date()) {
            const error = new Error("Cannot enter past date");
            error.statusCode = 400;
            error.errors = { message: "You are not a time traveler" };
            return next(error);
        }

        // Update the trip with the new data
        trip.passengers = passengers;
        trip.car = car;
        trip.departureDate = departureDate;
        trip.origin = origin;
        trip.destination = destination;
        trip.availableSeats = availableSeats;
        trip.distance = distance

        // Save the updated trip
        const updatedTrip = await trip.save();
        const populatedTrip = await Trip.populate(updatedTrip, [
            { path: "driver", select: "_id firstName lastName profilePicture phoneNumber" },
            { path: "car", select: "make model year licensePlateNumber insurance mpg fueleconomyId" },
            { path: "passengers.passenger", select: "_id firstName lastName profilePicture phoneNumber" },
        ]);
        res.json(populatedTrip);
    }
    catch(err) {
        next(err);
    }
});

// Remove trip
router.delete("/:id", requireUser, async (req, res, next) => {
    try {
        // Find the trip by its ID
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            const error = new Error("Trip not found");
            error.status = 404;
            error.errors = { message: "No trip found with that id" };
            return next(error);
        }

        // Check if the user is the driver of the trip
        if (trip.driver._id.toString() !== req.user._id.toString()) {
            const error = new Error("Unauthorized: You are not the driver of the trip");
            error.status = 403;
            error.errors = { message: "You are not the driver of the trip" }
            return next(error);
        }

        // Remove the trip from the database
        await trip.deleteOne();
        return res.json({ message: "Trip deleted successfully" });
    }
    catch(err) {
        next(err);
    }
});

module.exports = router;