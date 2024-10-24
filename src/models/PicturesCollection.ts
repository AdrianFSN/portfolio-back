import mongoose, { Document, Schema } from "mongoose";

interface interfacePicturesCollection extends Document {
  mainPicture: string;
  deleteMainPic: boolean;
  picture2: string;
  deletePic2: boolean;
  picture3: string;
  deletePic3: boolean;
  picture4: string;
  deletePic4: boolean;
  picture5: string;
  deletePic5: boolean;
  linkedJobExample: mongoose.Types.ObjectId;
}
