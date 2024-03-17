import Router from "express";
import { registerDrone } from "../controllers/drone.controller.js";

const router = Router();

router.post("/", registerDrone);

export default router;
