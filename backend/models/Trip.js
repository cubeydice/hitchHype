const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    driver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    passengers: [{ 
        // { passenger: passenger1Id, dropoffPoint: 'address1' },
        // { passenger: passenger2Id, dropoffPoint: 'address2' },
        passenger: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        dropoffPoint: {
            type: String,
            required: true
        },
    }],
    departureDate: {
        type: Date,
        required: true,
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
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