import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";
import VersionsController from "../controllers/VersionsController.js";

const router = express.Router();
router.put("/:id", isAuthenticated, isAuthorized, VersionsController.update);

export default router;
