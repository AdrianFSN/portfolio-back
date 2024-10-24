import express from "express";
import JobExampleController from "../controllers/JobExampleController.js";
import upload from "../middlewares/filesManagement.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = express.Router();

router.get("/", JobExampleController.get);
router.get("/:id", JobExampleController.getOneJobExample);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized,
  JobExampleController.delete
);

router.post(
  "/",
  isAuthenticated,
  isAuthorized,
  upload.fields([
    { name: "mainPicture", maxCount: 1 },
    { name: "picture2", maxCount: 1 },
    { name: "picture3", maxCount: 1 },
    { name: "picture4", maxCount: 1 },
    { name: "picture5", maxCount: 1 },
    { name: "videos", maxCount: 2 },
    { name: "audios", maxCount: 2 },
  ]),
  JobExampleController.create
);
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
    { name: "videos", maxCount: 2 },
    { name: "audios", maxCount: 2 },
  ]),
  JobExampleController.update
);

export default router;
