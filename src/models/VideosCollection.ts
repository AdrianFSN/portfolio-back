import mongoose, { Schema } from "mongoose";
import InterfaceVideosCollection from "../types/InterfaceVideosCollection.js";

const VideosCollectionSchema: Schema<InterfaceVideosCollection> = new Schema(
  {
    mainVideo: {
      type: String,
    },
    video2: {
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

const videosCollection = mongoose.model<InterfaceVideosCollection>(
  "VideosCollection",
  VideosCollectionSchema
);

export default videosCollection;
