import express from "express";
import VideosCollectionController from "../controllers/VideosCollectionController.js";
import upload from "../middlewares/filesManagement.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = express.Router();

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized,
  upload.fields([
    { name: "mainVideo", maxCount: 1 },
    { name: "video2", maxCount: 1 },
  ]),
  VideosCollectionController.update
);

export default router;
