import mongoose from "mongoose";

const batteryLogSchema = new mongoose.Schema({
  drone_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drone",
    required: true,
  },
  battery_level: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Battery = mongoose.model("Battery_Logs", batteryLogSchema);
export default Battery;
