import mongoose, { Schema } from "mongoose";

interface ContactFormParams {
  name: string;
  email: string;
  content: string;
  subject?: string[];
  opt_in: boolean;
  owner: string;
}
const receivedMessageSchema: Schema<ContactFormParams> = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    opt_in: {
      type: Boolean,
      required: true,
    },
    subject: {
      type: [String],
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

const receivedMessage = mongoose.model<ContactFormParams>(
  "ReceivedMessage",
  receivedMessageSchema
);

export default receivedMessage;
