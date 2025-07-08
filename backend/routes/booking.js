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
    body("passenger", "Passenger name is required").trim().notEmpty(),
    body("email", "Enter a valid email").isEmail(),
    body("doj", "Date of journey is required").notEmpty().isISO8601(),
    body("source", "Source is required").trim().notEmpty(),
    body("destination", "Destination is required").trim().notEmpty(),
    body("seatnumber", "Seat number must be a positive integer").isInt({
      min: 1,
    }),
    body("fare", "Fare must be a positive number").isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
      const { passenger, email, doj, source, destination, seatnumber, fare } =
        req.body;
      const booking = await Booking.create({
        user: req.user.id,
        passenger,
        email,
        doj,
        source,
        destination,
        seatnumber,
        fare,
      });
      return res.status(201).json({ success: true, booking });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "Seat already booked for this date.",
        });
      }
      console.error(err);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

//Fetch all bookings '/api/booking/fetchbookings'
router.get("/fetchbookings", fetchUser, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
