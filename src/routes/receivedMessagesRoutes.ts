import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import isAuthorized from "../middlewares/isAuthorized.js";
import ContactFormController from "../controllers/ContactFormController.js";

const router = express.Router();

router.get("/", isAuthenticated, isAuthorized, ContactFormController.get);
router.get(
  "/:id",
  isAuthenticated,
  isAuthorized,
  ContactFormController.getOneMessage
);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized,
  ContactFormController.delete
);
router.put("/:id", isAuthenticated, isAuthorized, ContactFormController.update);

router.post("/", ContactFormController.create);

export default router;
