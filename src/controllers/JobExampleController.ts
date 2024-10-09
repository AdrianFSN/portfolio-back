import { Request, Response } from "express";
import JobExample from "../models/JobExample.js";
import CustomError, { ValidationError } from "../types/CustomErrors.js"; // Asegúrate de que esta ruta es correcta
import BaseController from "./BaseController.js";

class JobExampleController extends BaseController {
  constructor() {
    super();
    this.create = this.create.bind(this); // Enlaza el método
    this.get = this.get.bind(this); // Enlaza el método
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { title, technologies, launchPeriod, info, customer, category } =
        req.body;

      if (
        !title ||
        !technologies ||
        !launchPeriod ||
        !info ||
        !customer ||
        !category
      ) {
        const validationError: ValidationError = new Error(
          "Validation failed"
        ) as ValidationError;
        validationError.statusCode = 400;
        validationError.state = "error";
        validationError.validationErrors = [
          "Title, technologies, launch period, customer, category, and info are required",
        ];

        throw validationError;
      }

      const newJob = new JobExample(req.body);

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

  async get(req: Request, res: Response): Promise<void> {
    try {
      const jobExamplesList = await JobExample.find();

      if (jobExamplesList) {
        this.handleSuccess(
          res,
          jobExamplesList,
          "Job examples list loaded successfully!"
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new JobExampleController();
