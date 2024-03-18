import mongoose from "mongoose";

const LoadedMedicationSchema = new mongoose.Schema({
  drone_id: {
    type: mongoose.Types.ObjectId,
    ref: "Drone",
    required: true,
  },
  medication_id: {
    type: mongoose.Types.ObjectId,
    ref: "Medication",
    required: true,
  },
  // quantity: {
  //   type: Number,
  //   default: 1,
  // },
});

const LoadedMedication = mongoose.model(
  "DroneMedication",
  LoadedMedicationSchema
);

export default LoadedMedication;
