import mongoose, { Document } from "mongoose";

interface interfaceJobExample extends Document {
  versions: mongoose.Types.ObjectId[];
  pictures: mongoose.Types.ObjectId;
  videos: mongoose.Types.ObjectId;
  audios?: string[];
  linkToUrl?: string;
  launchPeriod: string;
  owner: string;
}

export default interfaceJobExample;
