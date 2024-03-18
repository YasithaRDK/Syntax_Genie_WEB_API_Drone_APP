import Drone from "../models/drone.model.js";

//Register drone
export const registerDrone = async (req, res) => {
  try {
    const { serialNumber, model, weightLimit, batteryCapacity, state } =
      req.body;
    const newDrone = new Drone({
      serialNumber,
      model,
      weightLimit,
      batteryCapacity,
      state,
    });
    await newDrone.save();
    res.status(201).json(newDrone);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Serial number already exists." });
    }
    res.status(400).json({ message: error.message });
  }
};

//Show available drones
export const availableDrones = async (req, res) => {
  const drones = await Drone.find({ state: { $in: ["LOADING", "IDLE"] } });
  res.status(200).json(drones);
};
