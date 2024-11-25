import { Request, Response } from "express";
import BaseController from "./BaseController.js";
import path from "path";
import { fileURLToPath } from "url";
import {
  AUDIOS_COLLECTION_FIELDS,
  VALID_AUDIOS_FILES,
} from "../utils/constants.js";
import AudiosCollection from "../models/AudiosCollection.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import assignFilesToFields from "../utils/asignFilesToFields.js";
import deleteFilesFromCollection from "../utils/removeCollectionOfFiles.js";
import CustomError from "../types/CustomErrors.js";
import { selectDeletionFlags } from "../utils/deletionFilesMethods.js";
import createValidationError from "../utils/createValidationError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audiosFilePath = path.join(__dirname, "../../uploads/audio");
const audioFields = AUDIOS_COLLECTION_FIELDS;

class AudioCollectionController extends BaseController {
  constructor() {
    super();
    this.update = this.update.bind(this);
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { collectionId, deleteMainAudio, deleteAudio2 } = req.body;
      const requestedAudioCollection = await AudiosCollection.findById(
        collectionId
      );
      if (!requestedAudioCollection) {
        throw createDocumentNotFoundError(res.__("document_not_found"));
      }

      const deletionFlagsList: Record<"mainAudio" | "audio2", any> = {
        mainAudio: deleteMainAudio,
        audio2: deleteAudio2,
      };

      const selectedDeletionFlagsList = selectDeletionFlags(deletionFlagsList);

      if (selectedDeletionFlagsList.length > 0) {
        try {
          await deleteFilesFromCollection(
            selectedDeletionFlagsList,
            requestedAudioCollection,
            audiosFilePath
          );
          console.log("Audio file deleted successfully!");
        } catch (error) {
          console.log("Error deleting audio file: ", error);
        }
      }

      if (req.files) {
        const allFiles = Object.values(req.files) as Express.Multer.File[][];

        for (const fileArray of allFiles) {
          for (const file of fileArray) {
            if (!VALID_AUDIOS_FILES.includes(file.mimetype)) {
              throw createValidationError(res.__("validation_error"), [
                res.__("file_type_not_valid"),
              ]);
            }
          }
        }

        const files = Object.assign({}, req.files) as {
          [key: string]: Express.Multer.File[];
        };

        await assignFilesToFields(audioFields, files, requestedAudioCollection);
      }

      const fieldsToDelete = Object.keys(deletionFlagsList).filter(
        (key) =>
          deletionFlagsList[key as keyof typeof deletionFlagsList] === "true"
      );

      fieldsToDelete.forEach(async (field) => {
        const fileUploaded = req.files && field in req.files;

        if (!fileUploaded) {
          (requestedAudioCollection as any)[field] = "";
          await requestedAudioCollection.save();
        }
      });

      this.handleSuccess(
        res,
        requestedAudioCollection,
        res.__("audios_collection_updated")
      );
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new AudioCollectionController();
