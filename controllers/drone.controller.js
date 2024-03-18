import Medication from "../models/medication.model.js";
import Drone from "../models/drone.model.js";
import LoadedMedication from "../models/loadedMedication.model.js";
import mongoose from "mongoose";

/**registering a drone */
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
    res.status(201).json("");
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Serial number already exists." });
    }
    res.status(400).json({ message: error.message });
  }
};

/**checking available drones for loading */
export const availableDrones = async (req, res) => {
  try {
    const drones = await Drone.find({ state: { $in: ["LOADING", "IDLE"] } });
    res.status(200).json(drones);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**loading a drone with medication items */
export const loadMedicationsForDrone = async (req, res) => {
  try {
    const { drone_id } = req.params;
    const { medication_id } = req.body;

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
      return res.status(400).json({
        message: "Drone not available for load medications right now",
      });
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

/**checking loaded medication items for a given drone */
export const getMedicationsForDrone = async (req, res) => {
  const { drone_id } = req.params;
  try {
    // Find all loaded medications associated with the given droneId
    const loadedMedications = await LoadedMedication.find({
      drone_id: drone_id,
    }).populate("medication_id");

    if (!loadedMedications) {
      return res.status(404).json({ message: "No loaded medications founded" });
    }

    res.status(200).json(loadedMedications[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
