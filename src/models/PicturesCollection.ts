import mongoose, { Schema } from "mongoose";
import InterfacePicturesCollection from "../types/InterfacePicturesCollection.js";

const PicturesCollectionSchema: Schema<InterfacePicturesCollection> =
  new Schema(
    {
      mainPicture: {
        type: String,
      },
      picture2: {
        type: String,
      },
      picture3: {
        type: String,
      },
      picture4: {
        type: String,
      },
      picture5: {
        type: String,
      },
      linkedJobExample: {
        type: Schema.Types.ObjectId,
        ref: "JobExample",
        required: true,
        index: true,
      },
    },
    { timestamps: true }
  );

const picturesCollection = mongoose.model<InterfacePicturesCollection>(
  "PicturesCollection",
  PicturesCollectionSchema
);

export default picturesCollection;
