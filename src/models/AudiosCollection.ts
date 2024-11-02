import mongoose, { Schema } from "mongoose";
import InterfaceAudiosCollection from "../types/InterfaceAudiosCollection.js";

const AudiosCollectionSchema: Schema<InterfaceAudiosCollection> = new Schema(
  {
    mainAudio: {
      type: String,
    },
    audio2: {
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

const audiosCollection = mongoose.model<InterfaceAudiosCollection>(
  "AudiosCollection",
  AudiosCollectionSchema
);

export default audiosCollection;
