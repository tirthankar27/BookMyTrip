const express = require("express");
const router = express.Router();
const Place = require("../models/Places");
const Route = require("../models/Routes");
const Bus = require("../models/Buses");
const { body, validationResult } = require("express-validator");

// POST /api/data/place
router.post("/place", async (req, res) => {
  try {
    const { name, code, state } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const place = new Place({ name, code, state });
    await place.save();

    res.json({ success: true, place });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// GET /api/data/places
router.get("/places", async (req, res) => {
  try {
    const places = await Place.find();
    res.json({ success: true, places });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// GET /api/data/routes
router.get("/routes", async (req, res) => {
  try {
    const routes = await Route.find()
      .populate("from", "name state")
      .populate("to", "name state");

    res.json({ success: true, routes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// POST /api/data/bus (Dynamic Route Creation)
router.post("/bus", async (req, res) => {
  try {
    const {
      name,
      source,
      destination,
      distance,
      baseFare,
      departureTime,
      arrivalTime,
      daysOfWeek,
      totalSeats,
      availableSeats = totalSeats, // Default to totalSeats if not provided
      fareMultiplier = 1.0,
      busType = "Non-AC"
    } = req.body;

    // Validate required fields
    const requiredFields = ['name', 'source', 'destination', 'distance', 'baseFare', 
                           'departureTime', 'arrivalTime', 'daysOfWeek', 'totalSeats'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate business rules
    if (source === destination) {
      return res.status(400).json({ 
        success: false, 
        message: "Source and destination cannot be the same" 
      });
    }

    if (availableSeats > totalSeats) {
      return res.status(400).json({
        success: false,
        message: "Available seats cannot exceed total seats"
      });
    }

    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one operating day must be selected"
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(departureTime) || !timeRegex.test(arrivalTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:MM format"
      });
    }

    // Create new route
    const route = new Route({ 
      from: source, 
      to: destination, 
      distance, 
      basePrice: baseFare 
    });
    await route.save();

    // Create the bus
    const bus = new Bus({
      name,
      source,
      destination,
      distance,
      baseFare,
      route: route._id,
      departureTime,
      arrivalTime,
      daysOfWeek,
      totalSeats,
      availableSeats,
      fareMultiplier,
      busType
    });

    await bus.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Bus registered successfully",
      bus: {
        ...bus.toObject(),
        calculatedFare: Math.round(baseFare * fareMultiplier)
      }
    });

  } catch (err) {
    console.error("Error registering bus:", err);
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bus with similar details already exists"
      });
    }

    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: err.message 
    });
  }
});


// POST /api/data/availableseats
router.post("/availableseats", async (req, res) => {
  try {
    const { busId, doj } = req.body;
    if (!busId || !doj) {
      return res
        .status(400)
        .json({ success: false, message: "Bus ID and date are required" });
    }

    const bookedSeats = await Booking.find({ bus: busId, doj }).select(
      "seatnumber"
    );
    const seatNumbers = bookedSeats.map((b) => b.seatnumber);

    res.json({ success: true, bookedSeats: seatNumbers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;