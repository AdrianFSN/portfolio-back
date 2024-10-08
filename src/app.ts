import { Request, Response, NextFunction } from "express";
import CustomError, { FileUploadError } from "./types/CustomErrors";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import { connectMongoose } from "./lib/connectMongoose.js";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import developer from "./routes/developerJobRoutes.js";

const app = express();

// Get __dirname
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Load env variables from .env
dotenv.config();

// Connect Mongoose
connectMongoose();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// API routes
app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/developer-jobs", developer);
console.log("Esto es developerJobREouter: ", developer);

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
