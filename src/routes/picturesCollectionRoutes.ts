import express from "express";
import PicturesCollectionController from "../controllers/PicturesCollectionController.js";
import upload from "../middlewares/filesManagement.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = express.Router();

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized,
  upload.fields([
    { name: "mainPicture", maxCount: 1 },
    { name: "picture2", maxCount: 1 },
    { name: "picture3", maxCount: 1 },
    { name: "picture4", maxCount: 1 },
    { name: "picture5", maxCount: 1 },
  ]),
  PicturesCollectionController.update
);

export default router;
