import { NotAuthorized } from "../types/CustomErrors.js";

function createAuthorizationError(
  message: string = "Unauthorized",
  statusCode: number = 401,
  state: string = "error"
): NotAuthorized {
  const error: NotAuthorized = new Error(message) as NotAuthorized;
  error.statusCode = statusCode;
  error.state = state;
  return error;
}

export default createAuthorizationError;
