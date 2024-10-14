import { Request, Response } from "express";
import User from "../models/User.js";
import BaseController from "./BaseController.js";
import CustomError from "../types/CustomErrors.js";
import createValidationError from "../utils/createValidationError.js";
import createCustomError from "../utils/createCustomError.js";

class UserController extends BaseController {
  constructor() {
    super();
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, confirmPassword } = req.body;

      if (!username || !email || !password || !confirmPassword) {
        throw createValidationError("Validation error", [
          "Username, email, password and confirm password are required",
        ]);
      }

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        throw createValidationError("Validation error", [
          "Please enter a valid email address",
        ]);
      }

      const checkUsernameExists = await User.findOne({ username });

      if (checkUsernameExists) {
        throw createValidationError("Validation error", [
          `${username} is already in use`,
        ]);
      }

      const checkUserEmailExists = await User.findOne({ email });

      if (checkUserEmailExists) {
        throw createValidationError("Validation error", [
          `${email} is already in use`,
        ]);
      }

      if (password !== confirmPassword) {
        throw createValidationError("Validation error", [
          "Password and confirm password don't match",
        ]);
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

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { username, email } = req.body;
      const userId = req.params.id;

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

      if (email && !emailRegex.test(email)) {
        throw createValidationError("Validation error", [
          "Please enter a valid email address",
        ]);
      }

      const existingUser = await User.findById(userId);
      if (!existingUser) {
        throw createValidationError("Validation error", ["User not found"]);
      }

      if (username && username !== existingUser.username) {
        const checkUsernameExists = await User.findOne({ username });
        if (checkUsernameExists) {
          throw createValidationError("Validation error", [
            `${username} is already in use`,
          ]);
        }
        existingUser.username = username;
      }

      if (email && email !== existingUser.email) {
        const checkUserEmailExists = await User.findOne({ email });
        if (checkUserEmailExists) {
          throw createValidationError("Validation error", [
            `${email} is already in use`,
          ]);
        }
        existingUser.email = email;
      }

      const savedUser = await existingUser.save();
      savedUser.password = "******";

      this.handleSuccess(res, savedUser, "User updated successfully!");
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const obtainedUser = await User.findById({
        _id: userId,
      });

      if (!obtainedUser) {
        throw createCustomError(`User with ID ${userId} not found`, 404);
      }

      const deletedUser = await User.deleteOne({
        _id: userId,
      });
      if (deletedUser && obtainedUser) {
        this.handleSuccess(
          res,
          deletedUser,
          `User ${obtainedUser.username} deleted succesfully!`
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new UserController();
