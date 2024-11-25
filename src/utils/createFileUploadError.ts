import { FileUploadError } from "../types/CustomErrors";

const createFileUploadError = (
  message: string,
  file: Express.Multer.File
): FileUploadError => {
  const error = new Error(message) as FileUploadError;
  error.statusCode = 400;
  error.state = "error";
  error.fileName = file.originalname;
  error.mimeType = file.mimetype;
  return error;
};

export default createFileUploadError;
