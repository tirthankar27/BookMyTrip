const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },

  duration: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  inclusions: [String],

  exclusions: [String],

  image: {
    type: String,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_from_emails",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Package", PackageSchema);