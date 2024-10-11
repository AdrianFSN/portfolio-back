import { NextFunction, Request, Response } from "express";
import UserController from "../controllers/UserController.js";
import express from "express";
const router = express.Router();

/* POST new user */
router.post("/", UserController.create);

/* GET users listing. */
router.get("/", UserController.get);

export default router;
