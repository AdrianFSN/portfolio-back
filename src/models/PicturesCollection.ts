import mongoose, { Document, Schema } from "mongoose";

interface interfacePicturesCollection extends Document {
  mainPicture?: string;
  picture2?: string;
  picture3?: string;
  picture4?: string;
  picture5?: string;
  linkedJobExample: mongoose.Types.ObjectId;
}

const PicturesCollectionSchema: Schema<interfacePicturesCollection> =
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

const picturesCollection = mongoose.model<interfacePicturesCollection>(
  "PicturesCollection",
  PicturesCollectionSchema
);

export default picturesCollection;
