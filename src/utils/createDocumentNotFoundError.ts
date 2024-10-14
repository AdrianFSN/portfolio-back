// utils/createDocumentNotFoundError.ts
import { DocumentNotFound } from "../types/CustomErrors.js";

const createDocumentNotFoundError = (message: string): DocumentNotFound => {
  const error = new Error(message) as DocumentNotFound;
  error.statusCode = 404;
  error.state = "error";
  return error;
};

export default createDocumentNotFoundError;
