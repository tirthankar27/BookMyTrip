const mongoose = require("mongoose");

const RoomTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  pricePerNight: {
    type: Number,
    required: true,
  },

  totalRooms: {
    type: Number,
    required: true,
  },

  amenities: [
    {
      type: String,
    },
  ],

  images: [
    {
      type: String,
    },
  ],
});

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "place",
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    hotelAmenities: [
      {
        type: String,
      },
    ],

    hotelImages: [
      {
        type: String,
      },
    ],

    roomTypes: [RoomTypeSchema],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "hotel",
  HotelSchema
);