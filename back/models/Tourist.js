const mongoose = require("mongoose");

const TouristSchema = new mongoose.Schema({
  name: String,
  lat: Number,
  lon: Number,
  zone: String,
  status: { type: String, default: "pending" },
  lawEnforcementNotified: { type: Boolean, default: false },
  caseId: String,
  resolved: { type: Boolean, default: false },
  resolvedAt: Date,
  resolvedBy: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tourist", TouristSchema);
