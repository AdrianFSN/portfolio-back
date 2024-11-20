import { Request, Response } from "express";
import BaseController from "./BaseController.js";
import path from "path";
import { fileURLToPath } from "url";
import { PICTURES_COLLECTION_FIELDS } from "../utils/constants.js";
import PicturesCollection from "../models/PicturesCollection.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import assignFilesToFields from "../utils/asignFilesToFields.js";
import deleteFilesFromCollection from "../utils/removeCollectionOfFiles.js";
import CustomError from "../types/CustomErrors.js";
import resizeImage from "../services/requesters/resizeThumbnailRequest.js";
import { selectDeletionFlags } from "../utils/deletionFilesMethods.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesFilePath = path.join(__dirname, "../../uploads/image");
const thumbnailFilepath = path.join(imagesFilePath, "thumbnails");
const pictureFields = PICTURES_COLLECTION_FIELDS;

class PictureCollectionController extends BaseController {
  constructor() {
    super();
    this.update = this.update.bind(this);
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const {
        collectionId,
        deleteMainPicture,
        deletePicture2,
        deletePicture3,
        deletePicture4,
        deletePicture5,
      } = req.body;
      const requestedPicturesCollection = await PicturesCollection.findById(
        collectionId
      );
      if (!requestedPicturesCollection) {
        throw createDocumentNotFoundError(res.__("document_not_found"));
      }

      const deletionFlagsList: Record<
        "mainPicture" | "picture2" | "picture3" | "picture4" | "picture5",
        any
      > = {
        mainPicture: deleteMainPicture,
        picture2: deletePicture2,
        picture3: deletePicture3,
        picture4: deletePicture4,
        picture5: deletePicture5,
      };

      const selectedDeletionFlagsList = selectDeletionFlags(deletionFlagsList);
      /* const selectedFieldsToDelete = flaggedFileFieldsForDeletion(
        selectedDeletionFlagsList
      ); */

      if (selectedDeletionFlagsList.length > 0) {
        await deleteFilesFromCollection(
          selectedDeletionFlagsList,
          requestedPicturesCollection,
          imagesFilePath,
          thumbnailFilepath
        );
      }

      if (req.files) {
        const files = Object.assign({}, req.files) as {
          [key: string]: Express.Multer.File[];
        };

        await assignFilesToFields(
          pictureFields,
          files,
          requestedPicturesCollection
        );

        pictureFields.forEach(async (field: string) => {
          const picture =
            requestedPicturesCollection[
              field as keyof typeof requestedPicturesCollection
            ];

          if (picture) {
            const filePath = path.join(
              __dirname,
              "../../uploads/image",
              picture
            );

            try {
              const result = await resizeImage(filePath);
              console.log("Saved job example gets: ", result);
            } catch (error) {
              console.log("Error resizing image: ", error);
            }
          }
        });
      }

      const fieldsToDelete = Object.keys(deletionFlagsList).filter(
        (key) =>
          deletionFlagsList[key as keyof typeof deletionFlagsList] === "true"
      );

      fieldsToDelete.forEach(async (field) => {
        const fileUploaded = req.files && field in req.files;

        if (!fileUploaded) {
          (requestedPicturesCollection as any)[field] = "";
          await requestedPicturesCollection.save();
        }
      });

      this.handleSuccess(
        res,
        requestedPicturesCollection,
        res.__("pictures_collection_updated")
      );
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new PictureCollectionController();
