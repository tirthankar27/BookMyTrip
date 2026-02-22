const mongoose = require("mongoose");
const { Schema } = mongoose;

const routes = new Schema({
  from: { type: mongoose.Schema.Types.ObjectId, 
    ref: "Place", 
    required: true 
},
  to: { type: mongoose.Schema.Types.ObjectId, 
    ref: "Place", 
    required: true 
},
  distance: { type: Number, 
    required: true 
},
  basePrice: { type: Number,
     required: true
},
  isActive: { type: Boolean, 
    default: true 
},
});

module.exports = mongoose.model("routes", routes);
