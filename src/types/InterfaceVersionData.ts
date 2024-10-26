import { Document } from "mongoose";
import JobCategories from "./JobCategories.js";

export interface InterfaceVersionData extends Document {
  title: string;
  technologies: string[];
  info: string;
  customer: string;
  category: JobCategories[];
}
