const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Address Schema
const addressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    postalCode: String,
});

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
            addressSchema,
            required: true
        }
    }],
    departureTime: {
        type: Date,
        required: true,
    },
    origin: {
        addressSchema,
        required: true,
    },
    destination: {
        addressSchema,
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