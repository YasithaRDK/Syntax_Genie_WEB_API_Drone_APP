import Drone from "../models/drone.model.js";

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
