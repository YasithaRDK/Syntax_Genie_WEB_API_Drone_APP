import Router from "express";
import upload from "../config/multer.config.js";
import {
  getMedicationDetails,
  registerMedication,
} from "../controllers/medication.controller.js";

const router = Router();

router.post("/", upload.single("image"), registerMedication);
router.get("/", getMedicationDetails);

export default router;
