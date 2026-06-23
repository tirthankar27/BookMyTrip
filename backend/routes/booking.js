const express = require("express");
const router = express.Router();
const Booking = require("../models/Userbookings");
const Hotel = require("../models/Hotels");
const HotelBooking = require("../models/HotelBooking");
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

// Fetch Hotel Bookings
router.get(
  "/fetchhotelbookings",
  fetchUser,
  async (req, res) => {
    try {
      const bookings =
        await HotelBooking.find({
          user: req.user.id,
        })
          .populate(
            "hotel",
            "name address hotelImages"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  }
);

// Cancel Hotel Booking
router.delete(
  "/cancel-hotel-booking",
  fetchUser,
  async (req, res) => {
    try {
      const { bookingId } =
        req.body;

      const booking =
        await HotelBooking.findOne({
          _id: bookingId,
          user: req.user.id,
        });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message:
            "Booking not found",
        });
      }

      booking.status =
        "cancelled";

      await booking.save();

      res.json({
        success: true,
        message:
          "Hotel booking cancelled",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  }
);

// Cancel individual seat '/api/booking/cancel-seat'
router.delete("/cancel-seat", fetchUser, async (req, res) => {
  try {
    const { bookingId, seatIds, cancelAll } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // FULL CANCEL
    if (cancelAll) {
      await Booking.findByIdAndDelete(bookingId);
      return res.json({
        success: true,
        message: "Booking fully cancelled",
        deleted: true,
      });
    }

    // PARTIAL CANCEL
    if (!seatIds || seatIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No seats selected",
      });
    }

    booking.seats = booking.seats.filter(
      (seat) => !seatIds.includes(seat._id.toString())
    );

    // If no seats left → delete entire booking
    if (booking.seats.length === 0) {
      await Booking.findByIdAndDelete(bookingId);
      return res.json({
        success: true,
        message: "All seats cancelled, booking removed",
        deleted: true,
      });
    }

    // Recalculate total fare
    booking.totalFare = booking.seats.reduce(
      (sum, seat) => sum + seat.fare,
      0
    );

    await booking.save();

    res.json({
      success: true,
      message: "Selected seats cancelled",
      deleted: false,
      updatedBooking: booking,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Create Hotel Booking
router.post(
  "/hotel",
  fetchUser,
  async (req, res) => {
    try {
      const {
        hotelId,
        roomType,
        checkIn,
        checkOut,
        guests,
      } = req.body;

      const hotel = await Hotel.findById(
        hotelId
      );

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found",
        });
      }

      const selectedRoom =
        hotel.roomTypes.find(
          (room) =>
            room.type === roomType
        );

      if (!selectedRoom) {
        return res.status(404).json({
          success: false,
          message:
            "Room type not found",
        });
      }

      const roomsNeeded =
        Math.ceil(guests / 2);

      const nights =
        Math.ceil(
          (
            new Date(checkOut) -
            new Date(checkIn)
          ) /
            (1000 *
              60 *
              60 *
              24)
        );

      const totalAmount =
        selectedRoom.pricePerNight *
        roomsNeeded *
        nights;

      const booking =
        await HotelBooking.create({
          hotel: hotel._id,

          roomType:
            selectedRoom.type,

          user: req.user.id,

          checkIn,
          checkOut,

          guests,

          roomsBooked:
            roomsNeeded,

          totalAmount,

          status: "confirmed",
        });

      res.status(201).json({
        success: true,
        booking,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message:
          "Internal Server Error",
      });
    }
  }
);

module.exports = router;
