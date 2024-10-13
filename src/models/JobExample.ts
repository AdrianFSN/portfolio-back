import mongoose, { Document, Schema } from "mongoose";
import JobCategories from "../types/JobCategories.js";

interface interfaceJobExample extends Document {
  title: string;
  technologies: string[];
  pictures?: string[];
  videos?: string[];
  audios?: string[];
  info: string;
  customer: string;
  linkToUrl?: string;
  launchPeriod: string;
  category: JobCategories[];
  owner: string;
}

const jobExampleSchema: Schema<interfaceJobExample> = new Schema(
  {
    title: {
      type: String,
      required: true,
      index: true,
    },
    technologies: {
      type: [String],
      required: true,
      index: true,
    },
    pictures: {
      type: [String],
    },
    videos: {
      type: [String],
    },
    audios: {
      type: [String],
    },
    info: {
      type: String,
      required: true,
    },
    customer: {
      type: String,
      required: true,
    },
    linkToUrl: {
      type: String,
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
