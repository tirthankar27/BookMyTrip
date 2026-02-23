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
});

module.exports = mongoose.model("Place", places);
