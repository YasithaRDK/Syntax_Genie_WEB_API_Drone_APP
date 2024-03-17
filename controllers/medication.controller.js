import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import Medication from "../models/medication.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const registerMedication = async (req, res) => {
  try {
    const { name, weight, code } = req.body;
    const image = req.file ? req.file.path : null;

    const newMedication = Medication({ name, weight, code, image });
    await newMedication.save();
    res.json(newMedication);
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
