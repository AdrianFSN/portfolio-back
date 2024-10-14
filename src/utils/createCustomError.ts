// utils/createCustomError.ts
import CustomError from "../types/CustomErrors.js";

function createCustomError(
  message: string,
  statusCode: number = 500,
  state: string = "error"
): CustomError {
  const error: CustomError = new Error(message) as CustomError;
  error.statusCode = statusCode;
  error.state = state;
  return error;
}

export default createCustomError;
