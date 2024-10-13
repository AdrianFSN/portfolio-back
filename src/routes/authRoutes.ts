import AuthController from "../auth/AuthController.js";
import express from "express";

const router = express.Router();

/* Login*/
router.post("/", AuthController.login);
export default router;
