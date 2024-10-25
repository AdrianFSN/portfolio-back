import mongoose, { Document } from "mongoose";

interface interfaceAudiosCollection extends Document {
  mainAudio?: string;
  audio2?: string;
  linkedJobExample: mongoose.Types.ObjectId;
}

export default interfaceAudiosCollection;
