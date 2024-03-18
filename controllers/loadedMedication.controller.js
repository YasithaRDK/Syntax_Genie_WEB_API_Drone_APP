import Medication from "../models/medication.model.js";
import Drone from "../models/drone.model.js";
import LoadedMedication from "../models/loadedMedication.model.js";

export const loadMedication = async (req, res) => {
  try {
    const { drone_id, medication_id, quantity } = req.body;

    // Check if drone and medication exist
    const drone = await Drone.findById(drone_id);
    const medication = await Medication.findById(medication_id);

    if (!drone) {
      return res.status(404).json({ message: "Drone does not exist" });
    }

    if (!medication) {
      return res.status(404).json({ message: "Medication does not exist" });
    }

    // Check if drone is available and has sufficient battery level
    if (drone.batteryCapacity < 25) {
      return res.status(400).json({ message: "Battery level is below 25%" });
    }

    if (drone.state !== "LOADING" && drone.state !== "IDLE") {
      return res.status(400).json({ message: "Drone not available right now" });
    }

    // Calculate total weight of medication to be loaded
    const totalWeight = quantity
      ? medication.weight * quantity
      : medication.weight * 1;

    // Check weight limit
    if (totalWeight > drone.weightLimit) {
      return res.status(400).json({ message: "Weight exceeds drone limit" });
    }

    // Load medication onto the drone
    const newLoadedMedication = new LoadedMedication({
      drone_id,
      medication_id,
      quantity,
    });
    await newLoadedMedication.save();

    // Update drone state if weight is within or equal to limit
    if (totalWeight < drone.weightLimit) {
      drone.state = "LOADING";
      await drone.save();
    } else if (totalWeight === drone.weightLimit) {
      drone.state = "LOADED";
      await drone.save();
    }

    res.status(200).json({ message: "Medication loaded successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
