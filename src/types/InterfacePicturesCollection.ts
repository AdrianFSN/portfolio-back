import mongoose, { Document } from "mongoose";

interface interfacePicturesCollection extends Document {
  mainPicture?: string;
  picture2?: string;
  picture3?: string;
  picture4?: string;
  picture5?: string;
  linkedJobExample: mongoose.Types.ObjectId;
}

export default interfacePicturesCollection;
