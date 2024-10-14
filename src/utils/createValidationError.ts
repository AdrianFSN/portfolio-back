import { ValidationError } from "../types/CustomErrors";

function createValidationError(
  message: string,
  details: string[]
): ValidationError {
  const validationError: ValidationError = new Error(
    message
  ) as ValidationError;
  validationError.statusCode = 400;
  validationError.state = "error";
  validationError.validationErrors = details;
  return validationError;
}

export default createValidationError;
