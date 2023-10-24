const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    passengers: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
    }],
    departureTime: {
        type: Date,
        required: true,
    },
    startPoint: {
        type: String,
        required: true,
    },
    endPoint: {
        type: String,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
    }
})

module.exports = mongoose.model('Trip', tripSchema);