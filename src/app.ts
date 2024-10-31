import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import CustomError, { FileUploadError } from "./types/CustomErrors";
import createError from "http-errors";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import fs from "fs";
import { fileURLToPath } from "node:url";
import { connectMongoose } from "./lib/connectMongoose.js";
import i18n from "./lib/I18nConfigure.js";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/authRoutes.js";
import usersRouter from "./routes/userRoutes.js";
import jobExamplesRouter from "./routes/jobExampleRoutes.js";
import picturesCollectionRouter from "./routes/picturesCollectionRoutes.js";
import videosCollectionRouter from "./routes/VideosCollectionRoutes.js";
import audiosCollectionRouter from "./routes/AudiosCollectionRoutes.js";
import versionRouter from "./routes/versionsRoutes.js";

// Load env variables from .env
dotenv.config();

console.log(
  "DATABASE_URI:",
  process.env.DATABASE_URI,
  "type: ",
  typeof process.env.DATABASE_URI
);

// Connect Mongoose
connectMongoose();

const app = express();

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// view engine setup
const viewsPath = path.join(__dirname, "views");
console.log("Path to views:", viewsPath);

fs.readdir(viewsPath, (err, files) => {
  if (err) {
    console.error("Error reading views directory:", err);
  } else {
    console.log("Files in views directory:", files);
  }
});

app.set("views", viewsPath);
app.set("view engine", "ejs");

// Middlewares
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static paths
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use(i18n.init);
app.use("/api", indexRouter);
app.use("/api/session", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/job-examples", jobExamplesRouter);
app.use("/api/pictures-collection", picturesCollectionRouter);
app.use("/api/videos-collection", videosCollectionRouter);
app.use("/api/audios-collection", audiosCollectionRouter);
app.use("/api/version", versionRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send the error json
  res.status(err.statusCode || 500).json({
    state: err.state || "error",
    message: err.message,
    code: err.statusCode || 500,
    fileName: (err as FileUploadError).fileName || null,
    mimeType: (err as FileUploadError).mimeType || null,
  });
});

export default app;
