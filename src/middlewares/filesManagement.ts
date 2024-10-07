import { FileUploadError } from "../types/CustomErrors";
import multer, { FileFilterCallback } from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb: FileFilterCallback) => {
    const fileTypes = {
      image: /jpeg|jpg|gif|png$/,
      video: /mp4$/,
    };

    const isImage = fileTypes.image.test(file.mimetype);
    const isVideo = fileTypes.video.test(file.mimetype);

    if (isImage || isVideo) {
      cb(null, true);
    } else {
      const error: FileUploadError = new Error(
        "Error: File not valid. Only use jpg, gif or png for pictures or mp4 for video."
      ) as FileUploadError;

      error.statusCode = 400;
      error.state = "error";
      error.fileName = file.originalname;
      error.mimeType = file.mimetype;
      cb(error as any, false);
    }
  },
});

export default upload;
