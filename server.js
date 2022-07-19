import express from "express";
import mongoose from "mongoose";
import { APP_PORT, DB_URL } from "./config";
import errorHandler from "./middlewares/errorHandler";
import path from "path";
import cors from "cors";

const app = express();

import routes from "./routes";

//database connection
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DB connected...");
});

global.appRoot = path.resolve(__dirname);

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/api", routes);

app.use("/uploads", express.static("uploads"));

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("app is working");
});

const PORT = process.env.PORT || APP_PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
