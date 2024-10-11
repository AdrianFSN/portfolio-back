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
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (!username || !email || !password || !confirmPassword) {
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

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        const validationError: ValidationError = new Error(
          "Validation failed"
        ) as ValidationError;
        validationError.statusCode = 400;
        validationError.state = "error";
        validationError.validationErrors = [
          "Please enter a valid email address",
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

      const checkUserEmailExists = await User.findOne({ email });

      if (checkUserEmailExists) {
        const validationError: ValidationError = new Error(
          "Validation failed"
        ) as ValidationError;
        validationError.statusCode = 400;
        validationError.state = "error";
        validationError.validationErrors = [`${email} is already in use`];

        throw validationError;
      }

      if (password !== confirmPassword) {
        const validationError: ValidationError = new Error(
          "Validation failed"
        ) as ValidationError;
        validationError.statusCode = 400;
        validationError.state = "error";
        validationError.validationErrors = [
          "Password and confirm password don't match",
        ];

        throw validationError;
      }
      const newUser = new User({
        username,
        email,
        password,
      });

      const savedUser = await newUser.save();
      savedUser.password = "******";

      this.handleSuccess(res, savedUser, "User created successfully!");
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new UserController();
