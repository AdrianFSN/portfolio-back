import { Response, NextFunction } from "express";
import User from "../models/User.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import createValidationError from "../utils/createValidationError.js";
import { ForbiddenError } from "../types/CustomErrors.js";
import createForbiddenError from "../utils/createForbiddenError.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";

const isAuthorized = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createForbiddenError(res.__("forbidden_insufficient_permissions"));
    }

    const { userId } = req.user!;

    if (!userId) {
      throw createValidationError(res.__("validation_error"), [
        res.__("no_id_in_token"),
      ]);
    }

    const user = await User.findById(userId);

    if (!user) {
      throw createDocumentNotFoundError(
        res.__("user_not_found_by_id", { userId })
      );
    }

    if (user.role !== "admin") {
      throw createForbiddenError(res.__("forbidden_insufficient_permissions"));
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
