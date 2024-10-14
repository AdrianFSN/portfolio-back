import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { NotAuthorized } from "../types/CustomErrors.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";

const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const noToken: NotAuthorized = new Error(
        "No token found"
      ) as NotAuthorized;
      noToken.statusCode = 401;
      noToken.state = "error";
      noToken.message = "No token provided";

      throw noToken;
    }

    const token = (authHeader as string).split(" ")[1];

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      userId: string;
    };

    req.user = decodedToken;

    next();
    return;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        state: "error",
        message: "Invalid token",
        code: 401,
      });
    } else if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        state: "error",
        message: "Token has expired",
        code: 401,
      });
    } else {
      const authError = error as NotAuthorized;
      res.status(authError.statusCode || 401).json({
        state: authError.state || "error",
        message: authError.message || "Unauthorized",
        code: authError.statusCode || 401,
      });
    }
  }
};

export default isAuthenticated;
