const express = require("express");
const router = express.Router();
const Booking = require("../models/Userbookings");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");

//Create a booking '/api/booking/makebooking'
router.post(
  "/makebooking",
  fetchUser,
  [
    body("bus").isMongoId().withMessage("Invalid bus ID"),
    body("email").isEmail().normalizeEmail(),
    body("doj").isISO8601().withMessage("Invalid date format"),
    body("source").trim().notEmpty(),
    body("destination").trim().notEmpty(),

    body("seats")
      .isArray({ min: 1 })
      .withMessage("At least one seat is required"),

    body("seats.*.seatNumber")
      .isInt({ min: 1, max: 150 })
      .withMessage("Invalid seat number"),

    body("seats.*.passenger")
      .trim()
      .notEmpty()
      .withMessage("Passenger name is required"),

    body("seats.*.fare")
      .isFloat({ min: 0 })
      .withMessage("Invalid fare"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { seats } = req.body;

      const totalFare = seats.reduce((sum, seat) => sum + seat.fare, 0);

      const booking = await Booking.create({
        user: req.user.id,
        bus: req.body.bus,
        doj: req.body.doj,
        source: req.body.source,
        destination: req.body.destination,
        email: req.body.email,
        seats: seats,
        totalFare: totalFare,
        status: "confirmed",
      });

      res.status(201).json({
        success: true,
        booking,
        message: "Booking confirmed successfully",
      });

    } catch (err) {
      console.error(err);

      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "One or more seats are already booked for this date",
        });
      }

      res.status(500).send("Internal Server Error");
    }
  }
);

//Fetch all bookings '/api/booking/fetchbookings'
router.get("/fetchbookings", fetchUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("source", "name")
      .populate("destination", "name")
      .populate("bus", "name departureTime arrivalTime")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

//Delete specific bookings '/api/booking/deletebooking'
router.delete("/deletebooking", fetchUser, async (req, res) => {
  try {
    //Get the bookingid
    const { bookingId } = req.body;
    if (!bookingId) {
      return res
        .status(400)
        .json({ success: false, message: "Booking ID is required" });
    }
    //Find the booking associated with id
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    //Check if correct user is accessing the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    //Delete the booking
    await Booking.findByIdAndDelete(bookingId);
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Cancel individual seat '/api/booking/cancel-seat'
router.delete("/cancel-seat", fetchUser, async (req, res) => {
  try {
    const { bookingId, seatId } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Remove seat
    booking.seats = booking.seats.filter(
      (seat) => seat._id.toString() !== seatId
    );

    if (booking.seats.length === 0) {
      await Booking.findByIdAndDelete(bookingId);
      return res.json({ success: true, message: "Booking fully cancelled" });
    }

    // Recalculate total
    booking.totalFare = booking.seats.reduce(
      (sum, seat) => sum + seat.fare,
      0
    );

    await booking.save();

    res.json({ success: true, message: "Seat cancelled successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
