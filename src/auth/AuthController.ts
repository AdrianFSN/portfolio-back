import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import CustomError from "../types/CustomErrors.js";
import User from "../models/User.js";
import BaseController from "../controllers/BaseController.js";
//import createValidationError from "../utils/createValidationError.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import createCustomError from "../utils/createCustomError.js";

class AuthController extends BaseController {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw createCustomError(res.__("email_password_required"), 400);
        /* throw createValidationError(res.__("validation_error"), [
          res.__("email_password_required"),
        ]); */
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        throw createDocumentNotFoundError(res.__("invalid_credentials"));
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        throw createCustomError(res.__("invalid_credentials"), 400);
        /* throw createValidationError(res.__("validation_error"), [
          res.__("invalid_credentials"),
        ]); */
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "2h",
        }
      );

      user.password = "******";

      this.handleSuccess(res, { user, token }, res.__("login_successful"));
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new AuthController();
