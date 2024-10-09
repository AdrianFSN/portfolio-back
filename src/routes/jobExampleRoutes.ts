import { NextFunction, Request, Response } from "express";

import express from "express";
import JobExampleController from "../controllers/JobExampleController.js";
import upload from "../middlewares/filesManagement.js";
//import multer from "multer";

const router = express.Router();
//const upload = multer();

router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.send("respond with a resource");
});

router.post(
  "/",
  upload.fields([
    { name: "pictures", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  JobExampleController.create
);

export default router;
