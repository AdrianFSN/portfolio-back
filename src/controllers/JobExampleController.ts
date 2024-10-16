import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import JobExample from "../models/JobExample.js";
import CustomError from "../types/CustomErrors.js";
import BaseController from "./BaseController.js";
import isValidUrl from "../utils/validUrlChecker.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import createValidationError from "../utils/createValidationError.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import sendOrderToResizeEvent from "../services/requesters/resizeThumbnailRequest.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JobExampleController extends BaseController {
  constructor() {
    super();
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.delete = this.delete.bind(this);
    this.update = this.update.bind(this);
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.user!;

      const {
        title,
        technologies,
        launchPeriod,
        info,
        customer,
        category,
        linkToUrl,
      } = req.body;

      if (
        !title ||
        !technologies ||
        !launchPeriod ||
        !info ||
        !customer ||
        !category
      ) {
        throw createValidationError("Validation error", [
          "Title, technologies, launch period, customer, category, and info are required",
        ]);
      }

      if (!/^\d{4}\/(0[1-9]|1[0-2])$/.test(launchPeriod)) {
        throw createValidationError("Validation error", [
          `${launchPeriod} is not a valid format. Please use YYYY/MM.`,
        ]);
      }

      if (linkToUrl && !isValidUrl(linkToUrl)) {
        throw createValidationError("Validation error", [
          `${linkToUrl} is not a valid URL. Please provide a valid URL.`,
        ]);
      }

      const newJob = new JobExample(req.body);
      newJob.owner = userId;

      if (req.files) {
        const files = Object.assign({}, req.files) as {
          [key: string]: Express.Multer.File[];
        };

        if (files.pictures) {
          newJob.pictures = files.pictures.map((file) => file.filename);
        }

        if (files.videos) {
          newJob.videos = files.videos.map((file) => file.filename);
        }

        if (files.audios) {
          newJob.audios = files.audios.map((file) => file.filename);
        }
      }

      const savedJob = await newJob.save();

      if (savedJob && savedJob.pictures && savedJob.pictures.length > 0) {
        for (const item of savedJob.pictures) {
          const filePath = path.join(
            __dirname,
            "../",
            "../",
            "uploads/image",
            item
          );

          sendOrderToResizeEvent(filePath, (error, result) => {
            if (error) {
              console.error("Error resizing image: ", error);
            } else {
              console.log("Saved job example gets: ", result);
            }
          });
        }
      }

      this.handleSuccess(res, savedJob, "Developer job created successfully!");
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      let filters: any = {};

      if (req.query.hasOwnProperty("category")) {
        if (Array.isArray(req.query.category)) {
          filters.category = { $in: req.query.category };
        } else if (typeof req.query.category === "string") {
          filters.category = req.query.category;
        }
      }

      if (
        req.query.hasOwnProperty("launchPeriod") &&
        typeof req.query.launchPeriod === "string"
      ) {
        const year = req.query.launchPeriod;
        filters.launchPeriod = new RegExp(`^${year}/`);
      }

      if (req.query.hasOwnProperty("technologies")) {
        if (Array.isArray(req.query.technologies)) {
          filters.technologies = { $in: req.query.technologies };
        } else if (typeof req.query.technologies === "string") {
          filters.technologies = req.query.technologies;
        }
      }

      if (
        req.query.hasOwnProperty("customer") &&
        typeof req.query.customer === "string"
      ) {
        filters.customer = req.query.customer;
      }

      if (
        req.query.hasOwnProperty("title") &&
        typeof req.query.title === "string"
      ) {
        filters.title = req.query.title;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const sortField = (req.query.sort as string) || "createdAt";
      const sortOrder = req.query.order === "desc" ? -1 : 1;

      const jobExamplesList = await JobExample.find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder });

      const totalJobs = await JobExample.countDocuments(filters);
      const totalPages = Math.ceil(totalJobs / limit);

      if (jobExamplesList) {
        this.handleSuccess(
          res,
          {
            totalJobs,
            totalPages,
            currentPage: page,
            jobExamples: jobExamplesList,
          },
          jobExamplesList.length > 0
            ? "Job examples list loaded successfully!"
            : "Resource loaded successfully, but your job examples list is empty!"
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const jobExampleId = req.params.id;
      const obtainedJobExample = await JobExample.findById({
        _id: jobExampleId,
      });

      if (!obtainedJobExample) {
        throw createDocumentNotFoundError(
          `JobExample with ID ${jobExampleId} not found`
        );
      }

      if (obtainedJobExample.pictures) {
        obtainedJobExample.pictures.forEach((picture: string) => {
          const filePath = path.join(__dirname, "../../uploads/image", picture);
          if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        });
      }

      if (obtainedJobExample.videos) {
        obtainedJobExample.videos.forEach((video: string) => {
          const filePath = path.join(__dirname, "../../uploads/video", video);
          if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        });
      }

      if (obtainedJobExample.audios) {
        obtainedJobExample.audios.forEach((audio: string) => {
          const filePath = path.join(__dirname, "../../uploads/audio", audio);
          if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        });
      }

      const deletedJobExample = await JobExample.deleteOne({
        _id: jobExampleId,
      });
      if (deletedJobExample && obtainedJobExample) {
        this.handleSuccess(
          res,
          deletedJobExample,
          `Job ${obtainedJobExample.title} deleted succesfully!`
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const jobExampleId = req.params.id;
      const {
        title,
        technologies,
        launchPeriod,
        info,
        customer,
        category,
        linkToUrl,
      } = req.body;

      if (
        !title ||
        !technologies ||
        !launchPeriod ||
        !info ||
        !customer ||
        !category
      ) {
        throw createValidationError("Validation error", [
          "Title, technologies, launch period, customer, category, and info are required",
        ]);
      }

      if (!/^\d{4}\/(0[1-9]|1[0-2])$/.test(launchPeriod)) {
        throw createValidationError("Validation error", [
          `${launchPeriod} is not a valid format. Please use YYYY/MM.`,
        ]);
      }

      if (linkToUrl && !isValidUrl(linkToUrl)) {
        throw createValidationError("Validation error", [
          `${linkToUrl} is not a valid URL. Please provide a valid URL.`,
        ]);
      }

      const obtainedJobExample = await JobExample.findById({
        _id: jobExampleId,
      });

      if (!obtainedJobExample) {
        throw createDocumentNotFoundError(
          `JobExample with ID ${jobExampleId} not found`
        );
      }

      obtainedJobExample.title = title;
      obtainedJobExample.technologies = technologies;
      obtainedJobExample.launchPeriod = launchPeriod;
      obtainedJobExample.info = info;
      obtainedJobExample.customer = customer;
      obtainedJobExample.category = category;
      obtainedJobExample.linkToUrl = linkToUrl;

      if (req.files) {
        const files = Object.assign({}, req.files) as {
          [key: string]: Express.Multer.File[];
        };

        if (files.pictures) {
          (obtainedJobExample as any).pictures.forEach((picture: string) => {
            const filePath = path.join(
              __dirname,
              "../../uploads/image",
              picture
            );
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
              fs.unlinkSync(filePath);
            }
          });
          obtainedJobExample.pictures = files.pictures.map(
            (file) => file.filename
          );
        }

        if (files.videos) {
          (obtainedJobExample as any).videos.forEach((video: string) => {
            const filePath = path.join(__dirname, "../../uploads/video", video);
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
              fs.unlinkSync(filePath);
            }
          });
          obtainedJobExample.videos = files.videos.map((file) => file.filename);
        }

        if (files.audios) {
          (obtainedJobExample as any).audios.forEach((audio: string) => {
            const filePath = path.join(__dirname, "../../uploads/audio", audio);
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
              fs.unlinkSync(filePath);
            }
          });
          obtainedJobExample.audios = files.audios.map((file) => file.filename);
        }
      }

      const updatedJobExample = await obtainedJobExample.save();

      this.handleSuccess(res, updatedJobExample, "Job updated successfully!");
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new JobExampleController();
