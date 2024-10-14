import { Response, NextFunction } from "express";
import User from "../models/User.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import createValidationError from "../utils/createValidationError.js";
import { ForbiddenError } from "../types/CustomErrors.js";
import createForbiddenError from "../utils/createForbiddenError.js";

const isAuthorized = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.user!;

    if (!userId) {
      throw createValidationError("Validation error", [
        "No user ID found in token",
      ]);
    }

    const user = await User.findById(userId);

    if (!user) {
      throw createValidationError("Validation error", ["User not found"]);
    }

    if (user.role !== "admin") {
      throw createForbiddenError("Access denied: Insufficient permissions.");
    }

    next();
    return;
  } catch (error) {
    const forbiddenError = error as ForbiddenError;
    res.status(forbiddenError.statusCode || 403).json({
      state: forbiddenError.state || "error",
      message: forbiddenError.message || "Forbidden",
      code: forbiddenError.statusCode || 403,
    });
  }
};

export default isAuthorized;
