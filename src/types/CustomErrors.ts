export default interface CustomError extends Error {
  statusCode?: number;
  state?: string;
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
