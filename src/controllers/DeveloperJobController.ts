import { Request, Response } from "express";
import DeveloperJob from "../models/DeveloperJob";
import upload from "../middlewares/filesManagement";
import { CustomRequest } from "../types/CustomRequest";
import { ValidationError } from "../types/CustomErrors";

class DeveloperJobController {
  async create(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { title, technologies, launchPeriod, info } = req.body;

      if (!title || !technologies || !launchPeriod || !info) {
        const validationError: ValidationError = new Error(
          "Validation failed"
        ) as ValidationError;
        validationError.statusCode = 400;
        validationError.state = "error";
        validationError.validationErrors = [
          "Title, technologies, info and launch period are required",
        ];

        throw validationError;
      }

      const newJob = new DeveloperJob(req.body);

      if (req.files) {
        if (req.files.pictures) {
          newJob.pictures = (req.files.pictures as Express.Multer.File[]).map(
            (file) => file.originalname
          );
        }
        if (req.files.videos) {
          newJob.videos = (req.files.videos as Express.Multer.File[]).map(
            (file) => file.originalname
          );
        }
      }

      const savedJob = await newJob.save();

      res.status(201).json({
        state: "success",
        data: savedJob,
        message: "Developer job created successfully!",
      });
    } catch (error) {
      res.status(400).json({
        state: "error",
        message: "Error creating developer job",
        error: (error as any).message,
        code: 400,
      });
    }
  }
}

export default new DeveloperJobController();
