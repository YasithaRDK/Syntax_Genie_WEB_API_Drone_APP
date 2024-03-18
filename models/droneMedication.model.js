import mongoose from "mongoose";

const DroneMedicationSchema = mongoose.Schema(
  {
    drone_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drone",
      required: true,
    },
    medication_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

const DroneMedication = mongoose.model(
  "DroneMedication",
  DroneMedicationSchema
);

export default DroneMedication;
