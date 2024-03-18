import Router from "express";
import {
  availableDrones,
  registerDrone,
} from "../controllers/drone.controller.js";

const router = Router();

router.post("/", registerDrone);
router.get("/available-drone", availableDrones);

export default router;
