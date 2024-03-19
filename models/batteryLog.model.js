import mongoose from "mongoose";

const batteryLogSchema = new mongoose.Schema({
  drone_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drone",
    required: true,
  },
  eventType: {
    type: String,
    enum: ["BATTERY_LOW"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const BatteryLog = mongoose.model("BatteryLog", batteryLogSchema);

export default BatteryLog;
