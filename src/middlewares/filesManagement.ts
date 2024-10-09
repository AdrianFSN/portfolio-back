import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { FileUploadError } from "../types/CustomErrors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDirectories = {
  image: path.join(__dirname, "../../uploads/image"),
  video: path.join(__dirname, "../../uploads/video"),
  audio: path.join(__dirname, "../../uploads/audio"),
};

Object.values(uploadDirectories).forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.error(`Error creating directory ${dir}:`, err);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = "";
    if (/jpeg|jpg|gif|png$/.test(file.mimetype)) {
      dir = uploadDirectories.image;
    } else if (/mp4$/.test(file.mimetype)) {
      dir = uploadDirectories.video;
    } else if (/mp3|mpeg$/.test(file.mimetype)) {
      dir = uploadDirectories.audio;
    }
    cb(null, dir);
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
      audio: /mp3|mpeg$/,
    };

    const isImage = fileTypes.image.test(file.mimetype);
    const isVideo = fileTypes.video.test(file.mimetype);
    const isAudio = fileTypes.audio.test(file.mimetype);

    if (isImage || isVideo || isAudio) {
      cb(null, true);
    } else {
      const error: FileUploadError = new Error(
        "Error: File not valid. Only use jpg, gif or png for pictures, mp4 for video, and mp3 for audio."
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
