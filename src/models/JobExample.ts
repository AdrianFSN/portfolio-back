import mongoose, { Document, Schema } from "mongoose";
import interfaceJobExample from "../types/InterfaceJobExample.js";
/* interface interfaceJobExample extends Document {
  versions: mongoose.Types.ObjectId[];
  pictures?: string[];
  videos?: string[];
  audios?: string[];
  launchPeriod: string;
  linkToUrl?: string;
  owner: string;
} */

const jobExampleSchema: Schema<interfaceJobExample> = new Schema(
  {
    versions: [
      {
        type: Schema.Types.ObjectId,
        ref: "LocalizedJobExample",
      },
    ],
    pictures: {
      type: [String],
    },
    videos: {
      type: [String],
    },
    audios: {
      type: [String],
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
    owner: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

const jobExample = mongoose.model<interfaceJobExample>(
  "JobExample",
  jobExampleSchema
);

export default jobExample;
