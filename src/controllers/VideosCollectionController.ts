import { Request, Response } from "express";
import BaseController from "./BaseController.js";
import path from "path";
import { fileURLToPath } from "url";
import { VIDEOS_COLLECTION_FIELDS } from "../utils/constants.js";
import VideosCollection from "../models/VideosCollection.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import assignFilesToFields from "../utils/asignFilesToFields.js";
import deleteFilesFromCollection from "../utils/removeCollectionOfFiles.js";
import CustomError from "../types/CustomErrors.js";
import { selectDeletionFlags } from "../utils/deletionFilesMethods.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const videosFilePath = path.join(__dirname, "../../uploads/video");
const videoFields = VIDEOS_COLLECTION_FIELDS;

class VideoCollectionController extends BaseController {
  constructor() {
    super();
    this.update = this.update.bind(this);
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { collectionId, deleteMainVideo, deleteVideo2 } = req.body;
      const requestedVideoCollection = await VideosCollection.findById(
        collectionId
      );
      if (!requestedVideoCollection) {
        throw createDocumentNotFoundError(res.__("document_not_found"));
      }

      const deletionFlagsList: Record<"mainVideo" | "video2", any> = {
        mainVideo: deleteMainVideo,
        video2: deleteVideo2,
      };

      const selectedDeletionFlagsList = selectDeletionFlags(deletionFlagsList);

      if (selectedDeletionFlagsList.length > 0) {
        try {
          await deleteFilesFromCollection(
            selectedDeletionFlagsList,
            requestedVideoCollection,
            videosFilePath
          );
          console.log("Video file deleted successfully!");
        } catch (error) {
          console.log("Error deleting video file: ", error);
        }
      }

      if (req.files) {
        const files = Object.assign({}, req.files) as {
          [key: string]: Express.Multer.File[];
        };

        await assignFilesToFields(videoFields, files, requestedVideoCollection);
      }

      const fieldsToDelete = Object.keys(deletionFlagsList).filter(
        (key) =>
          deletionFlagsList[key as keyof typeof deletionFlagsList] === "true"
      );

      fieldsToDelete.forEach(async (field) => {
        const fileUploaded = req.files && field in req.files;

        if (!fileUploaded) {
          (requestedVideoCollection as any)[field] = "";
          await requestedVideoCollection.save();
        }
      });

      this.handleSuccess(
        res,
        requestedVideoCollection,
        res.__("videos_collection_updated")
      );
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new VideoCollectionController();
