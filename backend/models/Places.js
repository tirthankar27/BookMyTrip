const mongoose = require("mongoose");
const { Schema } = mongoose;

const places = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  state: {
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

});

module.exports = mongoose.model("Place", places);
