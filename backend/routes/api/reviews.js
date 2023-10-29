const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const Trip = mongoose.model("Trip");
const { requireUser } = require("../../config/passport");
const validateReviewInput = require("../../validations/review");
const Review = require("../../models/Review");

// path = /reviews
// Retrieve user's reviews
router.get('/:reviewerId', async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.reviewerId);
    } catch(err) {
        const error = new Error("User not found");
        error.statusCode = 404;
        error.errors = { message: "No user found with that id" };
        return next(error);
    }
    try {
        const reviews = await Review.find({ reviewer: user._id })
                                .sort({ createdAt: -1 })
                                .populate("reviewer", "_id firstName lastName")
                                .populate("reviewee", "_id firstName lastName" )
        return res.json(reviews);
    }
    catch(err) {
        const error = new Error("Error fetching reviews");
        error.statusCode = 500;
        error.errors = { message: "An error occurred while fetching reviews" };
        return next(error);
    }
});

// Retreive reviews made to user
router.get('/:revieweeId', async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.revieweeId);
    } catch(err) {
        const error = new Error("User not found");
        error.statusCode = 404;
        error.errors = { message: "No user found with that id" };
        return next(error);
    }
    try {
        const rides = await Trip.find({ "reviewee": user._id })
                                .sort({ createdAt: -1 })
                                .populate("reviewer", "_id firstName lastName")
                                .populate("reviewee", "_id firstName lastName")
        return res.json(rides);
    } catch(err) {
        return res.json([]);
    }
});

// Create a review
// path = trips/:id/reviews
router.post('/:tripId', requireUser, validateReviewInput, async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.tripId);

        if (!trip) {
            const error = new Error('1Trip not found');
            error.status = 404;
            error.errors = { message: '2Trip not found' };
            return next(error);
        }
        // Check if user is part of trip (either driver or passenger)
        const isDriver = trip.driver._id.toString() === req.user._id.toString()
        const isPassenger = trip.passengers.some(passenger => passenger.passenger._id.toString() === req.user._id.toString());
        console.log(trip.driver._id)
        console.log(req.user._id)
        console.log(isDriver)
        if (!isDriver && !isPassenger) {
            const error = new Error('Unauthorized: User is not part of this trip');
            error.status = 403; 
            error.errors = { message: 'You cannot review this trip because you are not part of it' };
            return next(error);
        }

        const { reviewee, rating, title, body } = req.body

        // Check if reviewer and reviewee are the same user
        if (reviewee === req.user._id.toString()) {
            const error = new Error('User cannot review themself');
            error.status = 400;
            error.errors = { message: 'You cannot review yourself' };
            return next(error);
        }

        const newReview = new Review({
            reviewer: req.user._id,
            reviewee,
            trip: req.params.tripId,
            isDriver,
            rating,
            title,
            body
        });
        const review = await newReview.save();
        const populatedReview = await Review.populate(review, [
            { path: "reviewer", select: "_id firstName lastName" },
            { path: "reviewee", select: "_id firstName lastName" }
        ]);
        return res.json(populatedReview);
    } catch(err) {
        next(err)
    }
});

// Update a review
router.patch('/:id', requireUser, validateReviewInput, async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id)

        if (!review) {
            const error = new Error("Review not found");
            error.status = 404;
            error.errors = { message: "No review found with that id" };
            return next(error);
        }

        const { rating, title, body } = req.body

        // Check if user is the reviewer
        if (review.reviewer._id.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized: User is not the reviewer');
            error.status = 403;
            error.errors = { message: 'User did not write this review' };
            return next(error);
        }

        // Update the review with the new data
        review.rating = rating,
        review.title = title,
        review.body = body

        const updatedReview = await review.save();
        const populatedReview = await Review.populate(updatedReview, [
            { path: "reviewer", select: "_id firstName lastName" },
            { path: "reviewee", select: "_id firstName lastName" }
        ]);
        return res.json(populatedReview);
    } catch(err) {
        next(err)
    }
});

// Remove a review
router.delete('/:id', requireUser, async (req, res, next) => {
    try{
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            const error = new Error('Review not found');
            error.status = 404;
            error.errors = { message: "No review found with that id" };
            return next(error);
        }
    
        // Check if user is the reviewer
        if (review.reviewer._id.toString() !== req.user._id.toString()) {
            const error = new Error('Unauthorized: User is not the reviewer');
            error.status = 403;
            error.errors = { message: 'User did not write this review' };
            return next(error);
        }

        await review.deleteOne();
        return res.json({ message: "Review deleted successfully" });
    } catch(err) {
        next(err);
    }
})

module.exports = router;