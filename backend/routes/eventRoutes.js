const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const { protect, adminOnly } = require("../middleware/authmiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
try {
const { search, category, location } = req.query;
const filter = {};

if (search) {
  filter.title = { $regex: search, $options: "i" };
}

if (category) {
  filter.category = { $regex: `^${category}$`, $options: "i" };
}

if (location) {
  filter.location = { $regex: location, $options: "i" };
}

const events = await Event.find(filter).sort({ date: 1 });

res.json({
  count: events.length,
  events,
});

} catch (error) {
res.status(500).json({
message: "Failed to fetch events",
error: error.message,
});
}
});

router.get("/:id", async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({ message: "Invalid event ID" });
}

const event = await Event.findById(req.params.id);

if (!event) {
  return res.status(404).json({ message: "Event not found" });
}

res.json(event);

} catch (error) {
res.status(500).json({ message: "Failed to fetch event" });
}
});

router.post("/", protect, adminOnly, async (req, res) => {
try {
const {
title,
description,
category,
location,
date,
image,
price,
totalTickets,
} = req.body;

if (
  !title ||
  !description ||
  !category ||
  !location ||
  !date ||
  price === undefined ||
  totalTickets === undefined
) {
  return res.status(400).json({
    message: "Please provide all required event details",
  });
}

if (
  !Number.isFinite(Number(price)) ||
  Number(price) < 0 ||
  !Number.isInteger(Number(totalTickets)) ||
  Number(totalTickets) < 1
) {
  return res.status(400).json({
    message: "Invalid price or ticket quantity",
  });
}

if (Number.isNaN(Date.parse(date)) || new Date(date) <= new Date()) {
  return res.status(400).json({
    message: "Event date must be in the future",
  });
}

const event = await Event.create({
  title,
  description,
  category,
  location,
  date,
  image,
  price: Number(price),
  totalTickets: Number(totalTickets),
  availableTickets: Number(totalTickets),
  createdBy: req.user._id,
});

res.status(201).json({
  message: "Event created successfully",
  event,
});

} catch (error) {
res.status(500).json({
message: "Failed to create event",
error: error.message,
});
}
});

router.put("/:id", protect, adminOnly, async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({ message: "Invalid event ID" });
}

const updates = {};
const allowedFields = [
  "title",
  "description",
  "category",
  "location",
  "date",
  "image",
  "price",
  "totalTickets",
];

for (const field of allowedFields) {
  if (req.body[field] !== undefined) {
    updates[field] = req.body[field];
  }
}

if (updates.price !== undefined) {
  updates.price = Number(updates.price);

  if (!Number.isFinite(updates.price) || updates.price < 0) {
    return res.status(400).json({ message: "Invalid price" });
  }
}

if (updates.date !== undefined) {
  if (
    Number.isNaN(Date.parse(updates.date)) ||
    new Date(updates.date) <= new Date()
  ) {
    return res.status(400).json({ message: "Invalid event date" });
  }
}

if (updates.totalTickets !== undefined) {
  const event = await Event.findById(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  const bookedTickets = event.totalTickets - event.availableTickets;
  const newTotal = Number(updates.totalTickets);

  if (!Number.isInteger(newTotal) || newTotal < bookedTickets) {
    return res.status(400).json({
      message: "Total tickets cannot be less than tickets already booked",
    });
  }

  updates.totalTickets = newTotal;
  updates.availableTickets = newTotal - bookedTickets;
}

const event = await Event.findByIdAndUpdate(
  req.params.id,
  { $set: updates },
  { new: true, runValidators: true }
);

if (!event) {
  return res.status(404).json({ message: "Event not found" });
}

res.json({
  message: "Event updated successfully",
  event,
});

} catch (error) {
res.status(500).json({
message: "Failed to update event",
error: error.message,
});
}
});
router.delete("/:id", protect, adminOnly, async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({ message: "Invalid event ID" });
}

const event = await Event.findById(req.params.id);

if (!event) {
  return res.status(404).json({ message: "Event not found" });
}

const Booking = require("../models/Booking");

const existingBookings = await Booking.exists({
  event: event._id,
  status: "confirmed",
});

if (existingBookings) {
  return res.status(409).json({
    message: "Cannot delete an event with confirmed bookings",
  });
}

await event.deleteOne();

res.json({ message: "Event deleted successfully" });

} catch (error) {
res.status(500).json({
message: "Failed to delete event",
error: error.message,
});
}
});

module.exports = router;