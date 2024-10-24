import { DatabaseError } from "../types/CustomErrors.js";

const createDatabaseError = (
  message: string,
  parameters?: unknown,
  query?: string
): DatabaseError => {
  const error = new Error(message) as DatabaseError;
  error.statusCode = 403;
  error.state = "error";
  error.parameters = parameters;
  error.query = query;
  return error;
};

export default createDatabaseError;
