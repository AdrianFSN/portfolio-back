export default interface CustomError extends Error {
  statusCode?: number;
  state?: string;
}

export interface DocumentNotFound extends CustomError {
  parameters?: unknown;
}

export interface NotAuthorized extends CustomError {
  parameters?: unknown;
}

export interface ValidationError extends CustomError {
  validationErrors: string[];
}

export interface FileUploadError extends CustomError {
  fileName?: string;
  mimeType?: string;
}

export interface DatabaseError extends CustomError {
  query?: string;
  parameters?: unknown;
}

export interface ForbiddenError extends CustomError {
  parameters?: unknown;
}
