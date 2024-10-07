import { Request } from "express";

export interface CustomRequest extends Request {
  body: {
    title: string;
    technologies: string[];
    launchPeriod: string;
    info: string;
  };
  files?: {
    pictures?: Express.Multer.File[]; // Aquí usas Express.Multer.File
    videos?: Express.Multer.File[]; // Asegúrate de que esto esté bien definido
  };
}
