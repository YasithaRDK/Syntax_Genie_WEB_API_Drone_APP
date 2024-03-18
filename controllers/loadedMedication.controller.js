import Medication from "../models/medication.model.js";
import Drone from "../models/drone.model.js";
import LoadedMedication from "../models/loadedMedication.model.js";

export const loadMedication = async (req, res) => {
  try {
    const { drone_id, medication_id } = req.body;

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

    if (drone.state === "LOADING") {
    }

    // Check weight limit
    if (medication.weight > drone.availableLimit) {
      return res.status(400).json({ message: "Weight exceeds drone limit" });
    }

    // Update drone state if weight is within or equal to limit
    if (medication.weight < drone.availableLimit) {
      const newAvailable = drone.availableLimit - medication.weight;
      drone.availableLimit = newAvailable;
      drone.state = "LOADING";
      await drone.save();
    } else if (medication.weight === drone.availableLimit) {
      drone.availableLimit = 0;
      drone.state = "LOADED";
      await drone.save();
    }

    // Load medication onto the drone
    const newLoadedMedication = new LoadedMedication({
      drone_id,
      medication_id,
    });
    await newLoadedMedication.save();

    res.status(200).json({ message: "Medication loaded successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
