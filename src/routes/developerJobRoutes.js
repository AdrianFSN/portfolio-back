import { Router } from "express";
import DeveloperJobController from "../controllers/DeveloperJobController";
import upload from "../middlewares/filesManagement";

const router = Router();

router.post(
  "/developer-jobs",
  upload.fields([
    { name: "pictures", maxCount: 5 },
    { name: "videos", maxCount: 2 },
  ]),
  DeveloperJobController.create
);

export default router;
