import { Request, Response } from "express";
import BaseController from "./BaseController.js";
import path from "path";
import { fileURLToPath } from "url";
import { VIDEOS_COLLECTION_FIELDS as AUDIOS_COLLECTION_FIELDS } from "../utils/collectionsRelatedLists.js";
import AudiosCollection from "../models/AudiosCollection.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import assignFilesToFields from "../utils/asignFilesToFields.js";
import deleteFilesFromCollection from "../utils/removeCollectionOfFiles.js";
import CustomError from "../types/CustomErrors.js";
import { selectDeletionFlags } from "../utils/deletionFilesMethods.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const audiosFilePath = path.join(__dirname, "../../uploads/video");
const audioFields = AUDIOS_COLLECTION_FIELDS;

class AudioCollectionController extends BaseController {
  constructor() {
    super();
    this.update = this.update.bind(this);
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const collectionId = req.params.id;
      const requestedAudioCollection = await AudiosCollection.findById(
        collectionId
      );
      if (!requestedAudioCollection) {
        throw createDocumentNotFoundError(res.__("document_not_found"));
      }

      const { deleteMainAudio, deleteVideo2: deleteAudio2 } = req.body;

      const deletionFlagsList = {
        mainAudio: deleteMainAudio,
        audio2: deleteAudio2,
      };

      const selectedDeletionFlagsList = selectDeletionFlags(deletionFlagsList);

      if (selectedDeletionFlagsList.length > 0) {
        await deleteFilesFromCollection(
          selectedDeletionFlagsList,
          requestedAudioCollection,
          audiosFilePath
        );
      }

      if (req.files) {
        const files = Object.assign({}, req.files) as {
          [key: string]: Express.Multer.File[];
        };

        await assignFilesToFields(audioFields, files, requestedAudioCollection);
      }

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
