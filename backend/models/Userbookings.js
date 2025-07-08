const mongoose = require("mongoose");
const { Schema } = mongoose;

const user_bookings = new Schema({
    passenger: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    doj: {
        type: Date,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
    seatnumber: {
        type: Number,
        required: true,
    },
    fare: {
        type: Number,
        required: true,
    },
});

//Ensures on same date two person can't have same seat
user_bookings.index({ doj: 1, seatnumber: 1 }, { unique: true });
module.exports = mongoose.model("user_bookings", user_bookings);