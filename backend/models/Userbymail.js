const mongoose = require("mongoose");
const { Schema } = mongoose;

const user_mail_Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "agency", "admin"],
    default: "user",
  },
  bookings: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("user_from_emails", user_mail_Schema);
module.exports = User;