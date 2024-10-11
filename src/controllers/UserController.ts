import { Request, Response } from "express";
import User from "../models/User.js";
import BaseController from "./BaseController.js";
import CustomError, { ValidationError } from "../types/CustomErrors.js";

class UserController extends BaseController {
  constructor() {
    super();
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
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
      if (savedUser) {
        savedUser.password = "******";
        this.handleSuccess(res, savedUser, "User created successfully!");
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      let filters: any = {};

      if (
        req.query.hasOwnProperty("role") &&
        typeof req.query.role === "string"
      ) {
        filters.role = req.query.role;
      }

      if (
        req.query.hasOwnProperty("username") &&
        typeof req.query.username === "string"
      ) {
        filters.username = req.query.username;
      }

      if (
        req.query.hasOwnProperty("email") &&
        typeof req.query.email === "string"
      ) {
        filters.email = req.query.email;
      }

      const usersList = await User.find(filters);

      if (usersList) {
        this.handleSuccess(
          res,
          usersList,
          usersList.length > 0
            ? "Users list loaded successfully!"
            : "Resource loaded successfully, but the user's list is empty"
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new UserController();
