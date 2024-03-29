import Router from "express";
import {
  availableDrones,
  batteryLevel,
  getAllDrones,
  getMedicationsForDrone,
  loadMedicationsForDrone,
  registerDrone,
} from "../controllers/drone.controller.js";

const router = Router();

router.post("/", registerDrone);
router.get("/", getAllDrones);
router.get("/available-drone", availableDrones);
router.post("/load-medication/:drone_id", loadMedicationsForDrone);
router.get("/get-loaded-medication/:drone_id", getMedicationsForDrone);
router.get("/battery-level/:drone_id", batteryLevel);

export default router;
