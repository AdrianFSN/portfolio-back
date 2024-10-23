import mongoose, { Document, Schema, Types } from "mongoose";
import JobCategories from "../types/JobCategories.js";

interface interfaceJobExample extends Document {
  versions: mongoose.Types.ObjectId[];
  pictures?: string[];
  videos?: string[];
  audios?: string[];
  launchPeriod: string;
  category: JobCategories[];
  owner: string;
}

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
    category: {
      type: [String],
      enum: Object.values(JobCategories),
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

const jobExample = mongoose.model<interfaceJobExample>(
  "JobExample",
  jobExampleSchema
);

export default jobExample;
