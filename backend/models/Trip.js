const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Address Schema
const addressSchema = {
    street: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
};

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
        dropoffPoint: addressSchema,
    }],
    departureDate: {
        type: Date,
        required: true,
    },
    origin: addressSchema,
    destination: addressSchema,
    availableSeats: {
        type: Number,
        required: true,
    },
    destinationPicutre: {
        type: String,
    }
})

module.exports = mongoose.model('Trip', tripSchema);