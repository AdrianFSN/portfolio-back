import { Document } from "mongoose";

export interface InterfaceVersionData extends Document {
  title: string;
  technologies: string[];
  info: string;
  customer: string;
}
