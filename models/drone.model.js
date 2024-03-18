import mongoose from "mongoose";

const DroneSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    maxLength: 100,
    unique: true,
    required: true,
  },
  model: {
    type: String,
    enum: ["Lightweight", "Middleweight", "Cruiserweight", "Heavyweight"],
    required: true,
  },
  weightLimit: {
    type: Number,
    max: 500,
    required: true,
  },
  availableLimit: {
    type: Number,
    default: function () {
      return this.weightLimit;
    },
  },
  batteryCapacity: {
    type: Number,
    required: true,
  },
  state: {
    type: String,
    enum: ["IDLE", "LOADING", "LOADED", "DELIVERING", "DELIVERED", "RETURNING"],
    default: "IDLE",
  },
});

const Drone = mongoose.model("Drone", DroneSchema);

export default Drone;
