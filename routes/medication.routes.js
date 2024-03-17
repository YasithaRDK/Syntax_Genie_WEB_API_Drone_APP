import Router from "express";
import upload from "../config/multer.config.js";
import { registerMedication } from "../controllers/medication.controller.js";

const router = Router();

router.post("/", upload.single("image"), registerMedication);

export default router;
