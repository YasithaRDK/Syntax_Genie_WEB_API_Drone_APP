import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    match: /^[A-Za-z0-9-_]+$/,
  },
  weight: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    uppercase: true,
    match: /^[A-Z0-9_]+$/,
  },
  image: {
    type: String,
  },
});

const Medication = mongoose.model("Medication", medicationSchema);

export default Medication;
