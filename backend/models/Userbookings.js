const mongoose = require("mongoose");
const { Schema } = mongoose;

const user_bookings = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user_from_emails',
    required: true,
  },
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
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
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

// Prevent same seat from being booked on the same bus for the same date
user_bookings.index({ bus: 1, doj: 1, seatnumber: 1 }, { unique: true });

module.exports = mongoose.model("user_bookings", user_bookings);