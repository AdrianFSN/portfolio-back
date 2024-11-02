import mongoose, { Document } from "mongoose";

interface InterfaceAudiosCollection extends Document {
  mainAudio?: string;
  audio2?: string;
  linkedJobExample: mongoose.Types.ObjectId;
}

export default InterfaceAudiosCollection;
