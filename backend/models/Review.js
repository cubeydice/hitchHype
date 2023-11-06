const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    trip: {
        type: Schema.Types.ObjectId,
        ref: 'Trip',
        required: true,
    },
    isDriver: {
        type: Boolean,
    },
    rating: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {
    timestamps: true, 
});

module.exports = mongoose.model('Review', reviewSchema);