const mongoose = require("mongoose");
const { Schema } = mongoose;

const user_bookings = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_from_emails",
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
    ref: "Bus",
    required: true,
  },

  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },

  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },

  seats: [
    {
      seatNumber: {
        type: Number,
        required: true,
      },
      passenger: {
        type: String,
        required: true,
      },
      fare: {
        type: Number,
        required: true,
      }
    }
  ],

  totalFare: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["confirmed", "cancelled", "pending"],
    default: "confirmed",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

user_bookings.index(
  { bus: 1, doj: 1, "seats.seatNumber": 1 },
  {
    unique: true,
    partialFilterExpression: { status: "confirmed" },
  }
);

// Add query helper for active bookings
user_bookings.query.active = function() {
  return this.where({ status: 'confirmed' });
};

module.exports = mongoose.model("user_bookings", user_bookings);