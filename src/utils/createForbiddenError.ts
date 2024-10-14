import { ForbiddenError } from "../types/CustomErrors.js";

const createForbiddenError = (
  message: string,
  parameters?: unknown
): ForbiddenError => {
  const error = new Error(message) as ForbiddenError;
  error.statusCode = 403;
  error.state = "error";
  error.parameters = parameters;
  return error;
};

export default createForbiddenError;
