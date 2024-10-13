import UserController from "../controllers/UserController.js";
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

/* POST new user */
router.post("/", UserController.create);

/* GET users listing. */
router.get("/", isAuthenticated, UserController.get);

/* PUT existing user */
router.put("/:id", isAuthenticated, UserController.update);

/* DELETE existing user */
router.delete("/:id", isAuthenticated, UserController.delete);

export default router;
