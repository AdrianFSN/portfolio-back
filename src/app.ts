import { Request, Response, NextFunction } from "express";
import CustomError, { FileUploadError } from "./types/CustomErrors";
import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import developerJobRouter from "./routes/developerJobRoutes";

const app = express();

// Load env variables from .env
require("dotenv").config();

// Connect Mongoose
require("./lib/connectMongoose");

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
app.use("/api/developer-jobs", developerJobRouter);

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
