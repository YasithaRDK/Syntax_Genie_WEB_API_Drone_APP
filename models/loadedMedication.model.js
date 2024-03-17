import mongoose from "mongoose";

const LoadedMedicationSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  drone: {
    type: mongoose.Types.ObjectId,
    ref: "Drone",
    required: true,
  },
  medication: {
    type: mongoose.Types.ObjectId,
    ref: "Medication",
    required: true,
  },
});

const LoadedMedication = mongoose.model(
  "DroneMedication",
  LoadedMedicationSchema
);

export default LoadedMedication;
