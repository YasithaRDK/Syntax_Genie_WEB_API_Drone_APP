import path, { dirname } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Medication from "../models/medication.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**registering medications */
export const registerMedication = async (req, res) => {
  try {
    const { name, weight, code } = req.body;
    const image = req.file ? req.file.path : null;

    const newMedication = new Medication({ name, weight, code, image });
    await newMedication.save();
    res.status(200).json({ message: "Medication added successfully" });
  } catch (error) {
    if (req.file) {
      const imagePath = path.join(__dirname, "..", req.file.path);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        }
      });
    }
    res.status(400).json({ message: error.message });
  }
};

/**get all medication details */
export const getMedicationDetails = async (req, res) => {
  try {
    const Medications = await Medication.find().select(
      "-createdAt -updatedAt -__v"
    );
    res.status(200).json(Medications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
