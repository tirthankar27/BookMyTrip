const mongoose = require("mongoose");
const { Schema } = mongoose;

const buses = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: [100, 'Bus name cannot exceed 100 characters']
  },
  route: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Route", 
    required: true 
  },
  source: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: true
  },
  distance: {
    type: Number,
    required: true,
    min: [1, 'Distance must be at least 1 km'],
    max: [5000, 'Distance cannot exceed 5000 km']
  },
  baseFare: {
    type: Number,
    required: true,
    min: [10, 'Base fare must be at least ₹10']
  },
  departureTime: { 
    type: String, 
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
  },
  arrivalTime: { 
    type: String, 
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
  },
  daysOfWeek: [
    { 
      type: String, 
      enum: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      required: true
    },
  ],
  totalSeats: { 
    type: Number, 
    required: true,
    min: [1, 'Bus must have at least 1 seat'],
    max: [100, 'Bus cannot have more than 100 seats']
  },
  availableSeats: { 
    type: Number, 
    required: true,
    validate: {
      validator: function(v) {
        return v <= this.totalSeats;
      },
      message: 'Available seats cannot exceed total seats'
    }
  },
  fareMultiplier: { 
    type: Number, 
    default: 1.0,
    min: [1.0, 'Fare multiplier cannot be less than 1.0'],
    max: [5.0, 'Fare multiplier cannot exceed 5.0']
  },
  busType: {
    type: String,
    enum: ["AC", "Non-AC", "Sleeper"],
    default: "Non-AC",
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
buses.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add a virtual property for calculated fare
buses.virtual('calculatedFare').get(function() {
  return Math.round(this.baseFare * this.fareMultiplier);
});

module.exports = mongoose.model("Bus", buses);