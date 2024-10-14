import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import CustomError from "../types/CustomErrors.js";
import User from "../models/User.js";
import BaseController from "../controllers/BaseController.js";
import createValidationError from "../utils/createValidationError.js";

class AuthController extends BaseController {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw createValidationError("Validation error", [
          "Email and password are required",
        ]);
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        throw createValidationError("Validation error", [
          "Invalid email or password",
        ]);
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        throw createValidationError("Validation error", [
          "Invalid email or password",
        ]);
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "2h",
        }
      );

      user.password = "******";

      this.handleSuccess(res, { user, token }, "Login successful!");
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new AuthController();
