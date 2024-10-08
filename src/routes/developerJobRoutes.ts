import { NextFunction, Request, Response } from "express";

import express from "express";
import DeveloperJobController from "../controllers/DeveloperJobController.js";
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
  DeveloperJobController.create
);

export default router;
