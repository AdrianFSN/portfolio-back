import mongoose, { Document } from "mongoose";

interface interfaceJobExample extends Document {
  versions: mongoose.Types.ObjectId[];
  pictures: mongoose.Types.ObjectId;
  videos: mongoose.Types.ObjectId;
  audios: mongoose.Types.ObjectId;
  linkToUrl?: string;
  launchPeriod: string;
  owner: string;
  category: string[];
}

export default interfaceJobExample;
