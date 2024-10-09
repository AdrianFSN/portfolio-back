import { Response } from "express";
import CustomError, {
  ValidationError,
  FileUploadError,
  DatabaseError,
} from "../types/CustomErrors.js";

class BaseController {
  protected handleSuccess(res: Response, data: unknown, message: string) {
    return res.status(201).json({
      state: "success",
      data,
      message,
    });
  }

  protected handleError(error: CustomError, res: Response) {
    if (this.isValidationError(error)) {
      return res.status(error.statusCode || 400).json({
        state: "error",
        message: "Validation error",
        validationErrors: error.validationErrors,
        code: error.statusCode || 400,
      });
    } else if (this.isFileUploadError(error)) {
      return res.status(error.statusCode || 400).json({
        state: "error",
        message: `File upload error: ${error.fileName} (${error.mimeType})`,
        code: error.statusCode || 400,
      });
    } else if (this.isDatabaseError(error)) {
      return res.status(error.statusCode || 500).json({
        state: "error",
        message: "Database error",
        query: error.query,
        parameters: error.parameters,
        code: error.statusCode || 500,
      });
    } else {
      return res.status(500).json({
        state: "error",
        message: "Internal server error",
        error: error.message,
        code: 500,
      });
    }
  }

  private isValidationError(error: CustomError): error is ValidationError {
    return (error as ValidationError).validationErrors !== undefined;
  }

  private isFileUploadError(error: CustomError): error is FileUploadError {
    return (
      (error as FileUploadError).fileName !== undefined &&
      (error as FileUploadError).mimeType !== undefined
    );
  }

  private isDatabaseError(error: CustomError): error is DatabaseError {
    return (
      (error as DatabaseError).query !== undefined &&
      (error as DatabaseError).parameters !== undefined
    );
  }
}

export default BaseController;
