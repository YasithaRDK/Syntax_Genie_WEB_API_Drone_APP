import Router from "express";
import {
  availableDrones,
  loadMedications,
  registerDrone,
} from "../controllers/drone.controller.js";

const router = Router();

router.post("/", registerDrone);
router.get("/available-drone", availableDrones);
router.post("/load-medication/:drone_id", loadMedications);

export default router;
