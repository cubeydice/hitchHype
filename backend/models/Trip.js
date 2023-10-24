const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    passengers: [{ 
        // { passenger: passenger1Id, dropoffPoint: 'Dropoff point 1' },
        // { passenger: passenger2Id, dropoffPoint: 'Dropoff point 2' },
        passenger: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        dropoffPoint: {
            type: String,
            required: true
        }
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
    },
    destinationPicutre: {
        type: String,
    }
})

module.exports = mongoose.model('Trip', tripSchema);