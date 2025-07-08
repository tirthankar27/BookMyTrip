const express = require("express");
const router = express.Router();
const Booking = require("../models/Userbookings");
const fetchUser = require("../middleware/fetchUser");

//Create a booking '/api/booking/makebooking'
router.post("/makebooking", fetchUser,async (req, res) => {
  try {
    const { passenger, email, doj, source, destination, seatnumber, fare } =
      req.body;

    if (
      !passenger ||
      !email ||
      !doj ||
      !source ||
      !destination ||
      !seatnumber ||
      !fare
    ) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong! All fields are required!",
      });
    }
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
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Fetch all bookings '/api/booking/fetchbookings'
router.get("/fetchbookings", fetchUser, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id });
        res.json(bookings);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
