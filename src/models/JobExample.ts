import mongoose, { Schema } from "mongoose";
import InterfaceJobExample from "../types/InterfaceJobExample.js";
import { VALID_CATEGORIES } from "../utils/constants.js";

const jobExampleSchema: Schema<InterfaceJobExample> = new Schema(
  {
    versions: [
      {
        type: Schema.Types.ObjectId,
        ref: "LocalizedJobExample",
      },
    ],
    pictures: {
      type: Schema.Types.ObjectId,
      ref: "PicturesCollection",
    },
    videos: {
      type: Schema.Types.ObjectId,
      ref: "VideosCollection",
    },
    audios: {
      type: Schema.Types.ObjectId,
      ref: "AudiosCollection",
    },
    launchPeriod: {
      type: String,
      required: true,
      index: true,
    },
    linkToUrl: {
      type: String,
      index: true,
    },
    linkToGitHub: {
      type: String,
      index: true,
    },
    category: {
      type: [String],
      enum: VALID_CATEGORIES,
      required: true,
      index: true,
    },
    owner: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const jobExample = mongoose.model<InterfaceJobExample>(
  "JobExample",
  jobExampleSchema
);

export default jobExample;
