import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User.js";
import BaseController from "./BaseController.js";
import CustomError, { ValidationError } from "../types/CustomErrors.js";

class UserController extends BaseController {
  constructor() {
    super();
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.login = this.login.bind(this);
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

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { username, email } = req.body;
      const userId = req.params.id;

      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

      if (email && !emailRegex.test(email)) {
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

      const existingUser = await User.findById(userId);
      if (!existingUser) {
        const validationError: ValidationError = new Error(
          "User not found"
        ) as ValidationError;
        validationError.statusCode = 404;
        validationError.state = "error";
        validationError.validationErrors = ["User not found"];
        throw validationError;
      }

      if (username && username !== existingUser.username) {
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
        existingUser.username = username;
      }

      if (email && email !== existingUser.email) {
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
        const errorGettingUser: CustomError = new Error(
          `User with ID ${userId} not found`
        );
        errorGettingUser.statusCode = 404;
        errorGettingUser.state = "error";

        throw errorGettingUser;
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

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      console.log("Esto es req.body: ", req.body);
      console.log(
        "Esto es req.body.email: ",
        req.body.email,
        typeof req.body.email
      );
      console.log(
        "Esto es req.body.password: ",
        req.body.password,
        typeof req.body.password
      );

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

export default new UserController();
