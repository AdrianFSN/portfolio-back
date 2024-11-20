import mongoose, { Document } from "mongoose";

interface InterfaceLocalizedJobExample extends Document {
  language: string;
  title: string;
  technologies: string[];
  info: string;
  description: string;
  customer: string;
  linkedJobExample: mongoose.Types.ObjectId;
}

export default InterfaceLocalizedJobExample;
