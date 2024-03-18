import Router from "express";
import { loadMedication } from "../controllers/loadedMedication.controller.js";

const router = Router();

router.post("/", loadMedication);

export default router;
