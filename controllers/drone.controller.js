import Medication from "../models/medication.model.js";
import Drone from "../models/drone.model.js";
import DroneMedication from "../models/droneMedication.model.js";
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
    res.status(200).json({ message: "Drone registered successfully" });
  } catch (error) {
    //customize duplication error message
    if (error.code === 11000) {
      return res.status(400).json({ message: "Serial number already exists." });
    }
    res.status(400).json({ message: error.message });
  }
};

/**checking available drones for loading */
export const availableDrones = async (req, res) => {
  try {
    const drones = await Drone.find({
      state: { $in: ["LOADING", "IDLE"] },
    })
      .select("-createdAt -updatedAt -__v")
      .sort({ state: -1, weightLimit: -1 });
    res.status(200).json(drones);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**loading a drone with medication items */
export const loadMedicationsForDrone = async (req, res) => {
  const { drone_id } = req.params;
  const { medication_id, quantity } = req.body;

  try {
    // Check if drone and medication exist
    const drone = await Drone.findById(drone_id);
    const medication = await Medication.findById(medication_id);

    if (!drone) {
      return res.status(404).json({ message: "Drone does not exist" });
    }

    if (!medication) {
      return res.status(404).json({ message: "Medication does not exist" });
    }

    // Check if drone is available
    if (drone.batteryCapacity < 25) {
      return res.status(400).json({ message: "Battery level is below 25%" });
    }

    if (drone.state !== "LOADING" && drone.state !== "IDLE") {
      return res.status(400).json({
        message: "Drone not available for load medications",
      });
    }

    // Check weight limit
    const totalWeightResult = await DroneMedication.aggregate([
      {
        $match: {
          $and: [
            { drone_id: new mongoose.Types.ObjectId(drone_id) },
            { state: "Active" },
          ],
        },
      },
      {
        $lookup: {
          from: "medications",
          localField: "medication_id",
          foreignField: "_id",
          as: "medicationInfo",
        },
      },
      { $unwind: "$medicationInfo" },
      {
        $group: {
          _id: null,
          totalWeight: {
            $sum: { $multiply: ["$medicationInfo.weight", "$quantity"] },
          },
        },
      },
    ]);

    const totalWeight = totalWeightResult[0]
      ? totalWeightResult[0].totalWeight
      : 0;

    // Check if the drone can carry the additional weight
    const newWeight = totalWeight + medication.weight * quantity;
    if (newWeight > drone.weightLimit) {
      return res
        .status(400)
        .json({ message: "Cannot load medication. Exceeds weight limit." });
    }

    //Update drone state if weight is within or equal to limit
    if (newWeight < drone.weightLimit) {
      drone.state = "LOADING";
      await drone.save();
    } else if (newWeight === drone.weightLimit) {
      drone.state = "LOADED";
      await drone.save();
    }

    // Load medication onto the drone
    const newLoadedMedication = new DroneMedication({
      drone_id,
      medication_id,
      quantity,
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
    //Check drone id is valid
    const drone = await Drone.findById(drone_id);

    if (!drone) {
      return res.status(404).json({ message: "Drone does not exist" });
    }

    //Get medication details according to drone id
    const loadedMedications = await DroneMedication.aggregate([
      {
        $match: { drone_id: new mongoose.Types.ObjectId(drone_id) },
      },
      {
        $lookup: {
          from: "medications",
          localField: "medication_id",
          foreignField: "_id",
          as: "medicationDetails",
        },
      },
      {
        $unwind: "$medicationDetails",
      },
      {
        $project: {
          _id: "$medicationDetails._id",
          name: "$medicationDetails.name",
          weight: "$medicationDetails.weight",
          code: "$medicationDetails.code",
          image: "$medicationDetails.image",
        },
      },
    ]);

    if (!loadedMedications || loadedMedications.length === 0) {
      return res.status(404).json({ message: "No loaded medications found" });
    }

    res.status(200).json(loadedMedications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**check drone battery level for a given drone */
export const batteryLevel = async (req, res) => {
  const { drone_id } = req.params;
  try {
    const drone = await Drone.findById(drone_id);

    if (!drone) {
      return res.status(404).json({ message: "Drone does not exist" });
    }
    res.json({ batteryLevel: drone.batteryCapacity });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
