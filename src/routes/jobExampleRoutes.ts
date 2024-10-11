import { NextFunction, Request, Response } from "express";

import express from "express";
import JobExampleController from "../controllers/JobExampleController.js";
import upload from "../middlewares/filesManagement.js";
//import multer from "multer";

const router = express.Router();
//const upload = multer();

router.get("/", JobExampleController.get);
router.delete("/:id", JobExampleController.delete);

router.post(
  "/",
  upload.fields([
    { name: "pictures", maxCount: 5 },
    { name: "videos", maxCount: 2 },
    { name: "audios", maxCount: 2 },
  ]),
  JobExampleController.create
);
router.put(
  "/:id",
  upload.fields([
    { name: "pictures", maxCount: 5 },
    { name: "videos", maxCount: 2 },
    { name: "audios", maxCount: 2 },
  ]),
  JobExampleController.update
);

export default router;
