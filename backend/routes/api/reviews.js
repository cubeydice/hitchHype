const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const { requireUser } = require("../../config/passport");
const validateReviewInput = require("../../validations/review");
const Review = require("../../models/Review");

// path = user/:id/reviews
// Retrieve user's reviews
router.get('/', async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.id);
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
                                .populate("reviewed", "_id firstName lastName" )
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
router.get('/reviewed', async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.id);
    } catch(err) {
        const error = new Error("User not found");
        error.statusCode = 404;
        error.errors = { message: "No user found with that id" };
        return next(error);
    }
    try {
        const rides = await Trip.find({ "reviewed": user._id })
                                .sort({ createdAt: -1 })
                                .populate("reviewer", "_id firstName lastName")
                                .populate("reviewed", "_id firstName lastName")
        return res.json(rides);
    } catch(err) {
        return res.json([]);
    }
});

// Create a review
router.post('/', requireUser, validateReviewInput, async (req, res, next) => {
    try {
        const { rating, title, body } = req.body

        // Check if reviewer and reviewed are the same user
        if (req.params.id === req.user._id.toString()) {
            const error = new Error('User cannot review themself');
            error.status = 400;
            error.errors = { message: 'You cannot review yourself' };
            return next(error);
        }

        const newReview = new Review({
            reviewer: req.user._id,
            reviewed: req.params.id,
            rating,
            title,
            body
        });
        const review = await newReview.save();
        const populatedReview = await Review.populate(review, [
            { path: "reviewer", select: "_id firstName lastName" },
            { path: "reviewed", select: "_id firstName lastName" }
        ]);
        return res.json(populatedReview);
    } catch(err) {
        next(err)
    }
});

// Update a review
router.patch('/:reviewId', requireUser, validateReviewInput, async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId)

        if (!review) {
            const error = new Error("Review not found");
            error.status = 404;
            error.errors = { message: "No review found with that id" };
            return next(error);
        }

        const { rating, title, body } = req.body

        // Check if user is the reviewer
        if (review.reviewer._id !== req.user._id.toString()) {
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
            { path: "reviewed", select: "_id firstName lastName" }
        ]);
        return res.json(populatedReview);
    } catch(err) {
        next(err)
    }
});

// Remove a review
router.delete('/:reviewId', requireUser, async (req, res, next) => {
    try{
        const review = await Review.findById(req.params.reviewId);
        
        if (!review) {
            const error = new Error('Review not found');
            error.status = 404;
            error.errors = { message: "No review found with that id" };
            return next(error);
        }
    
        // Check if user is the reviewer
        if (review.reviewer._id !== req.user._id.toString()) {
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