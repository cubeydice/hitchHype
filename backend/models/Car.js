const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    licensePlateNumber: {
        type: String,
        required: true,
    },
    insurance: {
        type: String,
        required: true,
    },
    mpg: {
        type: Number,
    },
    fueleconomyId: {
        type: Number,
    },
});

module.exports = mongoose.model('Car', carSchema);