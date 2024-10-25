import mongoose, { Schema } from "mongoose";
import interfaceVideosCollection from "../types/InterfaceVideosCollection.js";

const VideosCollectionSchema: Schema<interfaceVideosCollection> = new Schema(
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

const videosCollection = mongoose.model<interfaceVideosCollection>(
  "VideosCollection",
  VideosCollectionSchema
);

export default videosCollection;
