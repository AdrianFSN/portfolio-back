import mongoose, { Schema } from "mongoose";
import interfaceLocalizedJobExample from "../types/InterfaceLocalizedJobExample.js";

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
