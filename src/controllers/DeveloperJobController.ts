import { Request, Response } from "express";
import DeveloperJob from "../models/DeveloperJob";
import { CustomRequest } from "../types/CustomRequest"; // Asegúrate de que esta ruta es correcta
import { ValidationError } from "../types/CustomErrors"; // Asegúrate de que esta ruta es correcta

class DeveloperJobController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, technologies, launchPeriod, info } = req.body;
      console.log("esto es req.body: ", req.body);
      // Validar campos requeridos
      if (!title || !technologies || !launchPeriod || !info) {
        const validationError: ValidationError = new Error(
          "Validation failed"
        ) as ValidationError;
        validationError.statusCode = 400;
        validationError.state = "error";
        validationError.validationErrors = [
          "Title, technologies, launch period, and info are required",
        ];

        throw validationError;
      }

      const newJob = new DeveloperJob(req.body);

      console.log("Esto es newJob: ", newJob);

      /*    if (req.files) {
        if (req.files.pictures) {
          newJob.pictures = req.files.pictures.map((file) => file.originalname);
        }
        if (req.files.videos) {
          newJob.videos = req.files.videos.map((file) => file.originalname);
        }
      } */

      const savedJob = await newJob.save();

      res.status(201).json({
        state: "success",
        data: savedJob,
        message: "Developer job created successfully!",
      });
    } catch (error) {
      if ((error as ValidationError).validationErrors) {
        res.status((error as ValidationError).statusCode || 400).json({
          state: "error",
          message: "Validation error",
          validationErrors: (error as ValidationError).validationErrors,
          code: (error as ValidationError).statusCode || 400,
        });
      } else {
        res.status(500).json({
          state: "error",
          message: "Error creating developer job",
          error: (error as Error).message,
          code: 500,
        });
      }
    }
  }
}

export default new DeveloperJobController();
