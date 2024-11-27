import express from "express";
import upload from "../middlewares/filesManagement.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";
import ContactFormController from "../controllers/ContactFormController.js";

const router = express.Router();

router.get("/", ContactFormController.get);
router.get("/:id", ContactFormController.getOneMessage);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized,
  ContactFormController.delete
);

router.post("/", ContactFormController.create);

export default router;
