import express from "express";
import AudiosCollectionController from "../controllers/AudiosCollectionController.js";
import upload from "../middlewares/filesManagement.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = express.Router();

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized,
  upload.fields([
    { name: "mainAudio", maxCount: 1 },
    { name: "audio2", maxCount: 1 },
  ]),
  AudiosCollectionController.update
);

export default router;
