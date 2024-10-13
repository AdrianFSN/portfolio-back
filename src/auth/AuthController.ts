import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import CustomError, { ValidationError } from "../types/CustomErrors.js";
import User from "../models/User.js";
import BaseController from "../controllers/BaseController.js";

class AuthController extends BaseController {
  constructor() {
    super();
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const validationError: ValidationError = new Error(
          "Validation failed"
        ) as ValidationError;
        validationError.statusCode = 400;
        validationError.state = "error";
        validationError.validationErrors = ["Email and password are required"];
        throw validationError;
      }

      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        const validationError: ValidationError = new Error(
          "Validation failed"
        ) as ValidationError;
        validationError.statusCode = 400;
        validationError.state = "error";
        validationError.validationErrors = ["Invalid email or password"];
        throw validationError;
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        const validationError: ValidationError = new Error(
          "Validation failed"
        ) as ValidationError;
        validationError.statusCode = 400;
        validationError.state = "error";
        validationError.validationErrors = ["Invalid email or password"];
        throw validationError;
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
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
