import UserController from "../controllers/UserController.js";
import express from "express";
const router = express.Router();

/* POST new user */
router.post("/", UserController.create);

/* GET users listing. */
router.get("/", UserController.get);

/* PUT existing user */
router.put("/:id", UserController.update);

/* DELETE existing user */
router.delete("/:id", UserController.delete);

export default router;
