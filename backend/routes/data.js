const express = require("express");
const router = express.Router();
const Place = require("../models/Places");
const Route = require("../models/Routes");
const Bus = require("../models/Buses");
const Booking = require("../models/Userbookings");
const Package = require("../models/Packages");
const Hotel = require("../models/Hotels");
const HotelBooking = require("../models/HotelBooking");
const User = require("../models/Userbymail");
const fetchUser = require("../middleware/fetchUser");
const adminOnly = require("../middleware/admin");
const agencyOnly = require("../middleware/agency");
const { body, validationResult } = require("express-validator");

// POST /api/data/place Store the place name details
router.post("/place", fetchUser, agencyOnly, async (req, res) => {
  try {
    const { name, code, state } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const place = new Place({
      name,
      code,
      state,
      createdBy: req.user.id,
      status: "pending",
    });
    await place.save();

    res.json({
      success: true,
      message: "Place request submitted for approval",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//GET place name
router.get("/placename", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ success: false, msg: "Missing ID" });
    }
    const place = await Place.findById(id);
    if (!place) {
      return res.status(404).json({ success: false, msg: "No place found" });
    }
    return res.status(200).json({ success: true, place });
  } catch (error) {
    console.error("Error in /placename:", error);
    return res.status(500).json({ success: false, msg: "Server error" });
  }
});

// GET /api/data/places Get all the available places
router.get("/places", async (req, res) => {
  try {
    const places = await Place.find({ status: "approved" });
    res.json({ success: true, places });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// GET /api/data/routes Get all the routes
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

//GET /api/data/getbus
router.get("/getbus", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, msg: "Bus ID is required" });
    }
    const bus = await Bus.findById(id);
    if (!bus) {
      return res.status(404).json({ success: false, msg: "No bus found" });
    }
    return res.status(200).json({ success: true, bus });
  } catch (error) {
    return res.status(500).json({ success: false, msg: "No bus found" });
  }
});

// POST /api/data/bus (Dynamic Route Creation)
router.post("/bus", fetchUser, agencyOnly, async (req, res) => {
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
      busType = "Non-AC",
    } = req.body;

    // Validate required fields
    const requiredFields = [
      "name",
      "source",
      "destination",
      "distance",
      "baseFare",
      "departureTime",
      "arrivalTime",
      "daysOfWeek",
      "totalSeats",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Validate business rules
    if (source === destination) {
      return res.status(400).json({
        success: false,
        message: "Source and destination cannot be the same",
      });
    }

    if (availableSeats > totalSeats) {
      return res.status(400).json({
        success: false,
        message: "Available seats cannot exceed total seats",
      });
    }

    if (!Array.isArray(daysOfWeek) || daysOfWeek.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one operating day must be selected",
      });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(departureTime) || !timeRegex.test(arrivalTime)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Use HH:MM format",
      });
    }

    let route = await Route.findOne({
      from: source,
      to: destination,
    });
    // Create new route
    if (!route) {
      route = new Route({
        from: source,
        to: destination,
        distance,
        basePrice: baseFare,
      });
      await route.save();
    }

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
      busType,
      createdBy: req.user.id,
      status: "pending",
    });

    await bus.save();

    res.status(201).json({
      success: true,
      message: "Bus registration request submitted",
      bus: {
        ...bus.toObject(),
        calculatedFare: Math.round(baseFare * fareMultiplier),
      },
    });
  } catch (err) {
    console.error("Error registering bus:", err);

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Bus with similar details already exists",
      });
    }

    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
});

//Get /api/data/buses Fetch all the buses for the route
router.get("/buses", async (req, res) => {
  try {
    const { source, destination } = req.query;
    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        msg: "Source and destination are required",
      });
    }
    const buses = await Bus.find({
      source: source,
      destination: destination,
      status: "approved",
    });
    if (buses.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "No bus for this route" });
    }
    return res.status(200).json({ success: true, buses });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, msg: "Internal server error" });
  }
});

// POST /api/data/availableseats Check for available seats
router.post("/availableseats", async (req, res) => {
  try {
    const { busId, doj } = req.body;
    if (!busId || !doj) {
      return res
        .status(400)
        .json({ success: false, message: "Bus ID and date are required" });
    }

    const journeyDate = new Date(doj);
    const startOfDay = new Date(journeyDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(journeyDate.setHours(23, 59, 59, 999));

    const bookedSeats = await Booking.find({
      bus: busId,
      doj: { $gte: startOfDay, $lte: endOfDay },
    }).select("seatnumber");
    const bookedSeatNumbers = bookedSeats.map((b) => b.seatnumber);
    const bus = await Bus.findById(busId).select("totalSeats");
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }
    const totalSeats = bus.totalSeats || 0;
    const allSeats = Array.from({ length: totalSeats }, (_, i) => i + 1);
    const availableSeats = allSeats.filter(
      (seat) => !bookedSeatNumbers.includes(seat),
    );
    res.json({ success: true, seats: availableSeats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// GET /api/data//admin/pending-places Pending places
router.get("/admin/pending-places", fetchUser, adminOnly, async (req, res) => {
  try {
    const places = await Place.find({
      status: "pending",
    }).populate("createdBy", "username email");

    res.json({
      success: true,
      count: places.length,
      places,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//PUT /api/data/admin/approve-place/:id Approve place
router.put(
  "/admin/approve-place/:id",
  fetchUser,
  adminOnly,
  async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, { status: "approved" });

    res.json({
      success: true,
    });
  },
);

//PUT /api/data/admin/reject-place/:id Reject place
router.put(
  "/admin/reject-place/:id",
  fetchUser,
  adminOnly,
  async (req, res) => {
    await Place.findByIdAndUpdate(req.params.id, { status: "rejected" });

    res.json({
      success: true,
    });
  },
);

//GET api/data//admin/pending-buses Pending buses
router.get("/admin/pending-buses", fetchUser, adminOnly, async (req, res) => {
  try {
    const buses = await Bus.find({
      status: "pending",
    })
      .populate("source", "name")
      .populate("destination", "name")
      .populate("createdBy", "username email");

    res.json({
      success: true,
      count: buses.length,
      buses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//PUT /api/data//admin/approve-bus/:id Approve bus
router.put("/admin/approve-bus/:id", fetchUser, adminOnly, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus request not found",
      });
    }

    bus.status = "approved";

    await bus.save();

    res.json({
      success: true,
      message: "Bus approved successfully",
      bus,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//PUT /api/data//admin/reject-bus/:id Reject bus
router.put("/admin/reject-bus/:id", fetchUser, adminOnly, async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus request not found",
      });
    }

    bus.status = "rejected";

    await bus.save();

    res.json({
      success: true,
      message: "Bus rejected",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// POST /api/data/package
router.post("/package", fetchUser, agencyOnly, async (req, res) => {
  console.log("PACKAGE ROUTE HIT");
  try {
    const user = await User.findById(req.user.id);

    const {
      title,
      destination,
      duration,
      price,
      description,
      inclusions,
      exclusions,
      image,
    } = req.body;

    const newPackage = await Package.create({
      title,
      destination,
      duration,
      price,
      description,
      inclusions,
      exclusions,
      image,
      createdBy: req.user.id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Package submitted for approval",
      package: newPackage,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// GET /api/data/admin/pending-packages
router.get(
  "/admin/pending-packages",
  fetchUser,
  adminOnly,
  async (req, res) => {
    try {
      const packages = await Package.find({
        status: "pending",
      })
        .populate("destination", "name")
        .populate("createdBy", "username email");

      res.json({
        success: true,
        packages,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

// PUT /api/data/admin/approve-package/:id
router.put(
  "/admin/approve-package/:id",
  fetchUser,
  adminOnly,
  async (req, res) => {
    try {
      const packageDoc = await Package.findByIdAndUpdate(
        req.params.id,
        {
          status: "approved",
        },
        {
          new: true,
        },
      );

      res.json({
        success: true,
        package: packageDoc,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

// PUT /api/data/admin/reject-package/:id
router.put(
  "/admin/reject-package/:id",
  fetchUser,
  adminOnly,
  async (req, res) => {
    try {
      const packageDoc = await Package.findByIdAndUpdate(
        req.params.id,
        {
          status: "rejected",
        },
        {
          new: true,
        },
      );

      res.json({
        success: true,
        package: packageDoc,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

// GET /api/data/packages
router.get("/packages", async (req, res) => {
  try {
    const packages = await Package.find({
      status: "approved",
    }).populate("destination", "name state");

    res.json({
      success: true,
      packages,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// GET /api/data/package/:id
router.get("/package/:id", async (req, res) => {
  try {
    const packageDoc = await Package.findById(req.params.id)
      .populate("destination", "name state")
      .populate("createdBy", "username email");

    if (!packageDoc) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    res.json({
      success: true,
      package: packageDoc,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// POST /api/data/hotel
router.post("/hotel", fetchUser, agencyOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const {
      name,
      destination,
      address,
      description,
      hotelAmenities,
      hotelImages,
      roomTypes,
    } = req.body;

    const hotel = await Hotel.create({
      name,
      destination,
      address,
      description,
      hotelAmenities,
      hotelImages,
      roomTypes,
      createdBy: req.user.id,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      hotel,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// GET /api/data/admin/pending-hotels
router.get("/admin/pending-hotels", fetchUser, adminOnly, async (req, res) => {
  try {
    const hotels = await Hotel.find({
      status: "pending",
    })
      .populate("destination", "name state")
      .populate("createdBy", "username email");

    res.json({
      success: true,
      hotels,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// PUT /api/data/admin/approve-hotel/:id
router.put(
  "/admin/approve-hotel/:id",
  fetchUser,
  adminOnly,
  async (req, res) => {
    try {
      const hotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          status: "approved",
        },
        {
          new: true,
        },
      );

      res.json({
        success: true,
        hotel,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

// PUT /api/data/admin/reject-hotel/:id
router.put(
  "/admin/reject-hotel/:id",
  fetchUser,
  adminOnly,
  async (req, res) => {
    try {
      const hotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          status: "rejected",
        },
        {
          new: true,
        },
      );

      res.json({
        success: true,
        hotel,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  },
);

// GET /api/data/hotels
router.get("/hotels", async (req, res) => {
  const { destination } = req.query;

  try {
    let query = {
      status: "approved",
    };

    if (destination) {
      query.destination = destination;
    }

    const hotels = await Hotel.find(query).populate(
      "destination",
      "name state",
    );

    res.json({
      success: true,
      hotels,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// GET /api/data/hotel/:id
router.get("/hotel/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate("destination", "name state")
      .populate("createdBy", "username email");

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      });
    }

    res.json({
      success: true,
      hotel,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//GET /api/data/admin/pending-hotels
router.get("/admin/pending-hotels", fetchUser, adminOnly, async (req, res) => {
  try {
    const hotels = await Hotel.find({
      status: "pending",
    })
      .populate("destination", "name")
      .populate("createdBy", "username");

    res.json({
      success: true,
      hotels,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

//PUT /api/data/admin/aprove-hotel/:id
router.put(
  "/admin/approve-hotel/:id",
  fetchUser,
  adminOnly,
  async (req, res) => {
    try {
      const hotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          status: "approved",
        },
        {
          new: true,
        },
      );

      res.json({
        success: true,
        hotel,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
      });
    }
  },
);

//PUT /api/data/admin/reject-hotel/:id
router.put(
  "/admin/reject-hotel/:id",
  fetchUser,
  adminOnly,
  async (req, res) => {
    try {
      const hotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        {
          status: "rejected",
        },
        {
          new: true,
        },
      );

      res.json({
        success: true,
        hotel,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
      });
    }
  },
);

module.exports = router;
