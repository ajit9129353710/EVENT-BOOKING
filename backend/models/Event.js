const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
{
title: {
type: String,
required: true,
trim: true,
},
description: {
type: String,
required: true,
},
category: {
type: String,
required: true,
},
location: {
type: String,
required: true,
},
date: {
type: Date,
required: true,
},
image: {
type: String,
default: "",
},
price: {
type: Number,
required: true,
min: 0,
},
totalTickets: {
type: Number,
required: true,
min: 1,
},
availableTickets: {
type: Number,
required: true,
min: 0,
},
createdBy: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},
},
{ timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);