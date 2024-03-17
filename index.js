import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
});
