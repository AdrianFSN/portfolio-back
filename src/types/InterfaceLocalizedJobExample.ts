import mongoose from "mongoose";
import JobCategories from "./JobCategories";

interface interfaceLocalizedJobExample extends Document {
  language: string;
  title: string;
  technologies: string[];
  info: string;
  customer: string;
  linkedJobExample: mongoose.Types.ObjectId;
  category: JobCategories[];
}

export default interfaceLocalizedJobExample;
