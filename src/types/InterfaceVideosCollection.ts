import mongoose, { Document } from "mongoose";

interface InterfaceVideosCollection extends Document {
  mainVideo?: string;
  video2?: string;
  linkedJobExample: mongoose.Types.ObjectId;
}

export default InterfaceVideosCollection;
