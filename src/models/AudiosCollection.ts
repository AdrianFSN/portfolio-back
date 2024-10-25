import mongoose, { Schema } from "mongoose";
import interfaceAudiosCollection from "../types/InterfaceAudiosCollection.js";

const AudiosCollectionSchema: Schema<interfaceAudiosCollection> = new Schema(
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

const audiosCollection = mongoose.model<interfaceAudiosCollection>(
  "AudiosCollection",
  AudiosCollectionSchema
);

export default audiosCollection;
