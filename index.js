import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDb from "./config/db.config.js";
import droneRouter from "./routes/drone.routes.js";
import medicationRouter from "./routes/medication.routes.js";
import startBatteryCheckInterval from "./utills/droneBatterylog.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/drones", droneRouter);
app.use("/api/medications", medicationRouter);

startBatteryCheckInterval();

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
});
