import mongoose, { Document, Schema } from "mongoose";
import JobCategories from "../types/JobCategories.js";

interface interfaceLocalizedJobExample extends Document {
  language: string;
  title: string;
  technologies: string[];
  info: string;
  customer: string;
  linkToUrl?: string;
  linkedJobExample: mongoose.Schema.Types.ObjectId;
}

const LocalizedJobExampleSchema: Schema<interfaceLocalizedJobExample> =
  new Schema(
    {
      language: {
        type: String,
        enum: ["en", "es", "fr"],
        required: true,
        index: true,
      },
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
      linkedJobExample: {
        type: Schema.Types.ObjectId,
        ref: "JobExample",
        required: true,
        index: true,
      },
    },
    { timestamps: true }
  );

const localizedJobExample = mongoose.model<interfaceLocalizedJobExample>(
  "LocalizedJobExample",
  LocalizedJobExampleSchema
);

export default localizedJobExample;
