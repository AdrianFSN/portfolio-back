import mongoose, { Document, Schema } from "mongoose";

interface interfaceJobExample extends Document {
  title: string;
  technologies: string[];
  pictures?: string[];
  videos?: string[];
  audios?: string[];
  info: string;
  launchPeriod: string;
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

const jobExample = mongoose.model<interfaceJobExample>(
  "JobExample",
  jobExampleSchema
);

export default jobExample;
