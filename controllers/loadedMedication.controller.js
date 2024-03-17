// import Drone from "../models/Drone.Model.js";

// // Load medication items to a drone
// export const loadMedication = async (req, res) => {
//   try {
//     const drone = await Drone.findById(req.params.id);
//     // Check if drone is in LOADING state and battery level is above 25%
//     if (drone.state !== "LOADING") {
//       return res.status(400).json({ message: "Drone is not in LOADING state" });
//     }
//     if (drone.batteryLevel < 25) {
//       return res.status(400).json({ message: "Battery level is below 25%" });
//     }
//     // Check weight limit
//     const totalWeight = req.body.reduce((acc, med) => acc + med.weight, 0);
//     if (totalWeight > drone.weightLimit) {
//       return res
//         .status(400)
//         .json({ message: "Total weight exceeds drone limit" });
//     }
//     // Update drone's state and save changes
//     drone.state = "LOADED";
//     await drone.save();
//     res.status(200).json({ message: "Medication loaded successfully" });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };
