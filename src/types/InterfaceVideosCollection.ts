import mongoose, { Document } from "mongoose";

interface interfaceVideosCollection extends Document {
  mainVideo?: string;
  video2?: string;
  linkedJobExample: mongoose.Types.ObjectId;
}

export default interfaceVideosCollection;
