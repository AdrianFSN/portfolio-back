import UserController from "../controllers/UserController.js";
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";

const router = express.Router();

/* POST new user */
router.post("/", isAuthenticated, isAuthorized, UserController.create);

/* GET users listing. */
router.get("/", isAuthenticated, isAuthorized, UserController.get);

/* PUT existing user */
router.put("/:id", isAuthenticated, isAuthorized, UserController.update);

/* DELETE existing user */
router.delete("/:id", isAuthenticated, isAuthorized, UserController.delete);

export default router;
