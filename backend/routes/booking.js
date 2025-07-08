const express = require("express");
const router = express.Router();
const Booking = require("../models/Userbookings");

//Create a booking '/api/booking/makebooking'
router.post("/makebooking", async (req, res) => {
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
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
