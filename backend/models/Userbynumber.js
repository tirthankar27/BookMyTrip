const { Schema } = mongoose;

const mongoose = require("mongoose");

const user_mail_Schema = new Schema({
  username: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\+\d{1,5}\d{10}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  bookings: {
    type: Number,
    default: 0,
  },
});
