const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ADD BOOKING
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { serviceId, date, time, address } = req.body;

    if (!serviceId || !date || !time || !address) {
      return res.status(400).json({
        message: "Service, date, time and address required",
      });
    }

    const existingSlot = await Booking.findOne({
      service: serviceId,
      date: new Date(date),
      time,
      status: { $ne: "cancelled" },
    });

    if (existingSlot) {
      return res.status(400).json({
        message: "This time slot is already booked. Choose another time.",
      });
    }

    const booking = new Booking({
      user: req.user.id,
      service: serviceId,
      date,
      time,
      address,
      status: "pending",
    });

    await booking.save();

    res.json({
      message: "Booking added successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// MY BOOKINGS
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET BOOKED SLOTS
router.get("/slots", authMiddleware, async (req, res) => {
  try {
    const { serviceId, date } = req.query;

    if (!serviceId || !date) {
      return res.status(400).json({ message: "Service and date required" });
    }

    const bookings = await Booking.find({
      service: serviceId,
      date: new Date(date),
      status: { $ne: "cancelled" },
    });

    const bookedTimes = bookings.map((b) => b.time);

    res.json(bookedTimes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CANCEL BOOKING
router.put("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: GET ALL BOOKINGS
router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email role")
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: APPROVE BOOKING
router.put("/admin/approve/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "approved";
    await booking.save();

    res.json({ message: "Booking approved successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: REJECT BOOKING
router.put("/admin/reject/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "rejected";
    await booking.save();

    res.json({ message: "Booking rejected successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: COMPLETE BOOKING
router.put("/admin/complete/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "completed";
    await booking.save();

    res.json({ message: "Booking marked as completed", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// USER: ADD RATING & REVIEW
router.put("/review/:id", authMiddleware, async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        message: "You can review only completed bookings",
      });
    }

    if (booking.reviewed) {
      return res.status(400).json({
        message: "You already reviewed this booking",
      });
    }

    booking.rating = rating;
    booking.review = review || "";
    booking.reviewed = true;

    await booking.save();

    res.json({
      message: "Review submitted successfully",
      booking,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET REVIEWS FOR A SERVICE (GLOBAL)
router.get("/reviews/:serviceId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      service: req.params.serviceId,
      reviewed: true,
      status: "completed",
    });

    if (bookings.length === 0) {
      return res.json({ avg: 0, count: 0 });
    }

    const total = bookings.reduce((sum, b) => sum + b.rating, 0);
    const avg = total / bookings.length;

    res.json({
      avg: avg.toFixed(1),
      count: bookings.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;