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
    // phoneNumber: {
    //     type: String,
    //     required: true,
    // },
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
        type: Schema.Types.ObjectId, 
        ref: 'Trip', 
    }],
    rides: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Ride', 
    }],
    cars: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Car' 
    }],
    driverLicense: licenseSchema,
    address: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);