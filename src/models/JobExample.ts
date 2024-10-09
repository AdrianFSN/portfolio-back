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
}

const jobExampleSchema: Schema<interfaceJobExample> = new Schema({
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
    validate: {
      validator: function (value: string) {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid URL. Please provide a valid URL.`,
    },
  },
  launchPeriod: {
    type: String,
    required: true,
    index: true,
    validate: {
      validator: function (value: string) {
        return /^\d{4}\/(0[1-9]|1[0-2])$/.test(value);
      },
      message: (props: { value: string }) =>
        `${props.value} is not a valid format. Please use YYYY/MM.`,
    },
  },

  category: {
    type: [String],
    enum: Object.values(JobCategories),
    required: true,
    index: true,
  },
});

const jobExample = mongoose.model<interfaceJobExample>(
  "JobExample",
  jobExampleSchema
);

export default jobExample;
