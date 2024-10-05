import mongoose, { Document, Schema } from "mongoose";

interface interfaceDeveloperJob extends Document {
  title: string;
  technologies: string[];
  pictures?: string[];
  videos?: string[];
  info: string;
  launchPeriod: string;
}

const developerJobSchema: Schema<interfaceDeveloperJob> = new Schema({
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
  info: {
    type: String,
    required: true,
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
});

const developerJob = mongoose.model<interfaceDeveloperJob>(
  "DeveloperJob",
  developerJobSchema
);

export default developerJob;
