import mongoose, { Document } from "mongoose";

interface interfaceJobExample extends Document {
  versions: mongoose.Types.ObjectId[];
  pictures?: string[];
  videos?: string[];
  audios?: string[];
  launchPeriod: string;
  owner: string;
}

export default interfaceJobExample;
