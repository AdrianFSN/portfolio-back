import { Request, Response } from "express";
import User from "../models/User.js";
import BaseController from "./BaseController.js";
import CustomError from "../types/CustomErrors.js";
import createValidationError from "../utils/createValidationError.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";

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
        throw createValidationError(res.__("validation_error"), [
          res.__("user_fields_required"),
        ]);
      }

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        throw createValidationError(res.__("validation_error"), [
          res.__("email_not_valid"),
        ]);
      }

      const checkUsernameExists = await User.findOne({ username });

      if (checkUsernameExists) {
        throw createValidationError("validation_error", [
          res.__("username_already_exists", { username }),
        ]);
      }

      const checkUserEmailExists = await User.findOne({ email });

      if (checkUserEmailExists) {
        throw createValidationError(res.__("validation_error"), [
          res.__("email_already_exists", { email }),
        ]);
      }

      if (password !== confirmPassword) {
        throw createValidationError(res.__("validation_error"), [
          res.__("password_confirm_dont_match"),
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
        this.handleSuccess(res, savedUser, res.__("user_created_successfully"));
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
            ? res.__("users_list_loaded")
            : res.__("users_list_loaded_empty")
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
        throw createValidationError(res.__("validation_error"), [
          res.__("email_not_valid"),
        ]);
      }

      const existingUser = await User.findById(userId);
      if (!existingUser) {
        throw createDocumentNotFoundError(
          res.__("user_not_found_id", { userId })
        );
      }

      if (username && username !== existingUser.username) {
        const checkUsernameExists = await User.findOne({ username });
        if (checkUsernameExists) {
          throw createValidationError(res.__("validation_error"), [
            res.__("username_already_exists", { username }),
          ]);
        }
        existingUser.username = username;
      }

      if (email && email !== existingUser.email) {
        const checkUserEmailExists = await User.findOne({ email });
        if (checkUserEmailExists) {
          throw createValidationError(res.__("validation_error"), [
            res.__("email_already_exists", { email }),
          ]);
        }
        existingUser.email = email;
      }

      const savedUser = await existingUser.save();
      savedUser.password = "******";

      this.handleSuccess(res, savedUser, res.__("user_updated"));
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
      let obtainedUserName = "";

      if (obtainedUser) {
        obtainedUserName = obtainedUser.username;
      }

      if (!obtainedUser) {
        throw createDocumentNotFoundError(
          res.__("user_not_found_by_id", { userId })
        );
      }

      const deletedUser = await User.deleteOne({
        _id: userId,
      });
      if (deletedUser && obtainedUser) {
        this.handleSuccess(
          res,
          deletedUser,
          res.__("user_deleted", { obtainedUserName })
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new UserController();
