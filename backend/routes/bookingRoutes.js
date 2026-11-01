const express = require("express");
const mongoose = require("mongoose");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { protect } = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
try {
const quantity = Number(req.body.quantity);
const { eventId } = req.body;

if (
  !eventId ||
  !mongoose.isValidObjectId(eventId) ||
  !Number.isInteger(quantity) ||
  quantity < 1 ||
  quantity > 10
) {
  return res.status(400).json({
    message: "Provide a valid event ID and quantity between 1 and 10",
  });
}

const event = await Event.findOneAndUpdate(
  {
    _id: eventId,
    date: { $gt: new Date() },
    availableTickets: { $gte: quantity },
  },
  {
    $inc: { availableTickets: -quantity },
  },
  { new: true }
);

if (!event) {
  return res.status(400).json({
    message: "Event unavailable or not enough tickets",
  });
}

try {
  const booking = await Booking.create({
    user: req.user._id,
    event: event._id,
    quantity,
    totalAmount: event.price * quantity,
    bookingReference: crypto.randomUUID(),
  });

  return res.status(201).json({
    message: "Tickets booked successfully",
    booking,
  });
} catch (error) {
  await Event.updateOne(
    { _id: event._id },
    { $inc: { availableTickets: quantity } }
  );

  throw error;
}

} catch (error) {
res.status(500).json({
message: "Booking failed",
error: error.message,
});
}
});

router.get("/my-bookings", protect, async (req, res) => {
try {
const bookings = await Booking.find({
user: req.user._id,
})
.populate("event")
.sort({ createdAt: -1 });

res.json({
  count: bookings.length,
  bookings,
});

} catch (error) {
res.status(500).json({
message: "Failed to fetch bookings",
error: error.message,
});
}
});
router.delete("/:id", protect, async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({ message: "Invalid booking ID" });
}

const booking = await Booking.findOne({
  _id: req.params.id,
  user: req.user._id,
});

if (!booking) {
  return res.status(404).json({ message: "Booking not found" });
}

if (booking.status === "cancelled") {
  return res.status(400).json({
    message: "Booking already cancelled",
  });
}

const event = await Event.findOneAndUpdate(
  {
    _id: booking.event,
    date: { $gt: new Date() },
  },
  {
    $inc: { availableTickets: booking.quantity },
  },
  { new: true }
);

if (!event) {
  return res.status(400).json({
    message: "Past events cannot be cancelled",
  });
}

booking.status = "cancelled";
await booking.save();

res.json({
  message: "Booking cancelled successfully",
  booking,
});

} catch (error) {
res.status(500).json({
message: "Cancellation failed",
error: error.message,
});
}
});

module.exports = router;