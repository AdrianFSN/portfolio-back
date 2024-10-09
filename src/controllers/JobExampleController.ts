import { Request, Response } from "express";
import DeveloperJob from "../models/JobExample.js";
import CustomError, { ValidationError } from "../types/CustomErrors.js"; // Asegúrate de que esta ruta es correcta
import BaseController from "./BaseController.js";

class JobExampleController extends BaseController {
  constructor() {
    super();
    this.create = this.create.bind(this); // Enlaza el método
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, technologies, launchPeriod, info } = req.body;

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

      if (req.files) {
        const files = Object.assign({}, req.files) as {
          [key: string]: Express.Multer.File[];
        };

        if (files.pictures) {
          newJob.pictures = files.pictures.map((file) => file.originalname);
        }

        if (files.videos) {
          newJob.videos = files.videos.map((file) => file.originalname);
        }

        if (files.audios) {
          newJob.audios = files.audios.map((file) => file.originalname);
        }
      }

      const savedJob = await newJob.save();

      this.handleSuccess(res, savedJob, "Developer job created successfully!");
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new JobExampleController();
