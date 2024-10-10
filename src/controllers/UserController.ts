import { Request, Response } from "express";
import User from "../models/User.js";
import BaseController from "./BaseController.js";
import CustomError, { ValidationError } from "../types/CustomErrors.js";

class UserController extends BaseController {
  constructor() {
    super();
    this.create = this.create.bind(this);
  }

  async create(req: Request, res: Response): Promise<void> {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || password || !confirmPassword) {
      const validationError: ValidationError = new Error(
        "Validation failed"
      ) as ValidationError;
      validationError.statusCode = 400;
      validationError.state = "error";
      validationError.validationErrors = [
        "Username, email, password and confirm password are required",
      ];

      throw validationError;
    }
    const checkUsernameExists = await User.findOne({ username });

    if (checkUsernameExists) {
      const validationError: ValidationError = new Error(
        "Validation failed"
      ) as ValidationError;
      validationError.statusCode = 400;
      validationError.state = "error";
      validationError.validationErrors = [`${username} is already in use`];

      throw validationError;
    }
  }
}
