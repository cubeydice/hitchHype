const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Car = require('./carModel'); // Import the Car schema

// Driver's License Schema
const licenseSchema = new Schema({
    licenseNumber: String,
    dateIssued: Date,
    dateExpiration: Date,
    stateIssued: String,
});

// Address Schema
const addressSchema = new Schema({
    street: String,
    city: String,
    state: String,
    postalCode: String,
});

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    biography: {
        type: String,
        // require: true,
    },
    profilePicture: {
        type: String,
        // require: true,
    },
    // location: {
        // type: {
        //     type: String,
        //     default: 'Point',
        // },
        // coordinates: [Number],
    // },
    trips: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Trip', 
    }],
    rides: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ride', 
    }],
    cars: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car' 
    }],
    driverLicense: licenseSchema,
    address: addressSchema,
    insurance: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);