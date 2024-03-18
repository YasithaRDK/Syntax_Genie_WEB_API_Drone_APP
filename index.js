import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDb from "./config/db.config.js";
import errorHandler from "./middlewares/error.middleware.js";
import droneRouter from "./routes/drone.routes.js";
import medicationRouter from "./routes/medication.routes.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/drones", droneRouter);
app.use("/api/medications", medicationRouter);

app.use(errorHandler);

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
});
