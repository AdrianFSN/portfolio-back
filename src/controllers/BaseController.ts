import { Response } from "express";
import CustomError, {
  ValidationError,
  FileUploadError,
  DatabaseError,
  DocumentNotFound,
  NotAuthorized,
} from "../types/CustomErrors.js";

class BaseController {
  protected handleSuccess(res: Response, data: unknown, message: string) {
    return res.status(200).json({
      state: "success",
      data,
      message,
    });
  }

  protected handleError(error: CustomError, res: Response) {
    if (this.isValidationError(error)) {
      return res.status(error.statusCode || 400).json({
        state: "error",
        message: res.__(error.message || "validation_error"),
        validationErrors: error.validationErrors,
        code: error.statusCode || 400,
      });
    } else if (this.isFileUploadError(error)) {
      const errorFilename = error.fileName || "unknown file";
      const errorMimeType = error.mimeType || "unknown mime type";

      return res.status(error.statusCode || 400).json({
        state: "error",
        message: res.__("fileupload_error", { errorFilename, errorMimeType }),
        code: error.statusCode || 400,
      });
    } else if (this.isDatabaseError(error)) {
      return res.status(error.statusCode || 500).json({
        state: "error",
        message: res.__(error.message || "database_error"),
        query: error.query,
        parameters: error.parameters,
        code: error.statusCode || 500,
      });
    } else if (this.isDocumentNotFound(error)) {
      return res.status(error.statusCode || 404).json({
        state: "error",
        message: res.__("document_not_found"),
        error: error.message,
        code: error.statusCode || 404,
      });
    } else if (this.isNotAuthorized(error)) {
      return res.status(error.statusCode || 404).json({
        state: "error",
        message: res.__("unauthorized"),
        error: error.message,
        code: error.statusCode || 401,
      });
    } else {
      return res.status(500).json({
        state: "error",
        message: res.__("internal_server_error"),
        error: error.message,
        code: 500,
      });
    }
  }

  private isDocumentNotFound(error: CustomError): error is DocumentNotFound {
    return (error as DocumentNotFound).message !== undefined;
  }

  private isNotAuthorized(error: CustomError): error is NotAuthorized {
    return (error as NotAuthorized).message !== undefined;
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
