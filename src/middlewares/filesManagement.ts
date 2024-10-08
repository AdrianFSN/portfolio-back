import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { FileUploadError } from "../types/CustomErrors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectory = path.join(__dirname, "../../uploads/developerJobs");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
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
      );
      error.statusCode = 400;
      error.state = "error";
      error.fileName = file.originalname;
      error.mimeType = file.mimetype;
      cb(error as any, false);
    }
  },
});

export default upload;
