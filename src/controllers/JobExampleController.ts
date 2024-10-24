import { Request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import JobExample from "../models/JobExample.js";
import LocalizedJobExample from "../models/LocalizedJobExample.js";
import CustomError, { DocumentNotFound } from "../types/CustomErrors.js";
import BaseController from "./BaseController.js";
import isValidUrl from "../utils/validUrlChecker.js";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import createValidationError from "../utils/createValidationError.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import resizeImage from "../services/requesters/resizeThumbnailRequest.js";
import mongoose from "mongoose";
import interfaceJobExample from "../types/InterfaceJobExample.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JobExampleController extends BaseController {
  constructor() {
    super();
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.getOneJobExample = this.getOneJobExample.bind(this);
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
        throw createValidationError(res.__("validation_error"), [
          res.__("required_fields_for_job"),
        ]);
      }

      if (!/^\d{4}\/(0[1-9]|1[0-2])$/.test(launchPeriod)) {
        throw createValidationError(res.__("validation_error"), [
          res.__("invalid_format_launch_period", { launchPeriod }),
        ]);
      }

      if (linkToUrl && !isValidUrl(linkToUrl)) {
        throw createValidationError(res.__("validation_error"), [
          res.__("invalid_url_format", { linkToUrl }),
        ]);
      }

      const newJobExampleData = {
        pictures: req.body.pictures,
        videos: req.body.videos,
        audios: req.body.audios,
        launchPeriod: req.body.launchPeriod,
        linkToUrl: req.body.linkToUrl,
        owner: userId,
      };

      const newJob = new JobExample(newJobExampleData);

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

      const versionsData = [
        {
          language: "en",
          title: req.body.title,
          technologies: req.body.technologies,
          info: req.body.info,
          customer: req.body.customer,
          linkedJobExample: newJob._id,
          category: req.body.category,
        },
        {
          language: "es",
          title: req.body.title,
          technologies: req.body.technologies,
          info: req.body.info,
          customer: req.body.customer,
          linkedJobExample: newJob._id,
          category: req.body.category,
        },
        {
          language: "fr",
          title: req.body.title,
          technologies: req.body.technologies,
          info: req.body.info,
          customer: req.body.customer,
          linkedJobExample: newJob._id,
          category: req.body.category,
        },
      ];

      const versions = await LocalizedJobExample.create(versionsData);
      const versionsIds = versions.map(
        (version) => version._id as mongoose.Types.ObjectId
      );

      if (newJob) {
        newJob.versions = versionsIds;
      }

      const savedJob = await newJob.save();

      if (savedJob && savedJob.pictures && savedJob.pictures.length > 0) {
        savedJob.pictures.forEach(async (item: string) => {
          const filePath = path.join(__dirname, "../../uploads/image", item);
          try {
            const result = await resizeImage(filePath);
            console.log("Saved job example gets: ", result);
          } catch (error) {
            console.log("Error resizing image: ", error);
          }
        });
      }

      this.handleSuccess(
        res,
        savedJob,
        res.__("job_example_created_successfully")
      );
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      let filters: any = {};
      const userLanguage = req.headers["accept-language"] || "en";

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
        .populate({
          path: "versions",
          match: {
            language: userLanguage,
          },
          select: "language title info technologies customer category",
        })
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
            ? res.__("job_example_list_loaded")
            : res.__("job_list_empty")
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async getOneJobExample(req: Request, res: Response): Promise<void> {
    const jobExampleId = req.params.id;
    const userLanguage = req.headers["accept-language"] || "en";

    try {
      const obtainedJobExample = (await JobExample.findById(
        jobExampleId
      ).populate({
        path: "versions",
        match: { language: userLanguage },
        select: "language title info technologies customer category",
      })) as interfaceJobExample;

      if (obtainedJobExample) {
        const version = obtainedJobExample.versions[0] as any;
        //const flattenedVersion = Object.assign({}, version) as any;
        //jobTitle = flattenedVersion._doc.title;
        const jobTitle = version.title;

        this.handleSuccess(
          res,
          obtainedJobExample,
          res.__("job_example_loaded_successfully", { jobTitle })
        );
      } else {
        throw createDocumentNotFoundError(res.__("document_not_found"));
      }
    } catch (error) {
      this.handleError(error as DocumentNotFound, res);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const jobExampleId = req.params.id;
      const obtainedJobExample = await JobExample.findById(
        jobExampleId
      ).populate({
        path: "versions",
        select: "title",
      });

      if (!obtainedJobExample) {
        throw createDocumentNotFoundError(
          res.__("job_example_not_found", { jobExampleId })
        );
      }

      let jobTitle = "";

      if (
        obtainedJobExample.versions &&
        obtainedJobExample.versions.length > 0
      ) {
        const version = obtainedJobExample.versions[0] as any;
        jobTitle = version.title;

        await LocalizedJobExample.deleteMany({
          linkedJobExample: jobExampleId,
        });
      }

      const imagesFilePath = path.join(__dirname, "../../uploads/image");
      const thumbnailFilepath = path.join(imagesFilePath, "thumbnails");

      if (obtainedJobExample.pictures) {
        await Promise.all(
          obtainedJobExample.pictures.map(async (picture: string) => {
            const imgFilePath = path.join(imagesFilePath, picture);
            const thumbFilepath = path.join(
              thumbnailFilepath,
              "thumbnail_" + picture
            );

            try {
              await fs.remove(imgFilePath);
              console.log("Image deleted successfully:", imgFilePath);
            } catch (err) {
              console.error("Error deleting image:", err);
            }

            try {
              await fs.remove(thumbFilepath);
              console.log("Thumbnail deleted successfully:", thumbFilepath);
            } catch (err) {
              console.error("Error deleting thumbnail:", err);
            }
          })
        );
      }

      if (obtainedJobExample.videos) {
        await Promise.all(
          obtainedJobExample.videos.map(async (video: string) => {
            const filePath = path.join(__dirname, "../../uploads/video", video);
            try {
              await fs.remove(filePath);
              console.log("Video deleted successfully:", filePath);
            } catch (err) {
              console.error("Error deleting video:", err);
            }
          })
        );
      }

      if (obtainedJobExample.audios) {
        await Promise.all(
          obtainedJobExample.audios.map(async (audio: string) => {
            const filePath = path.join(__dirname, "../../uploads/audio", audio);
            try {
              await fs.remove(filePath);
              console.log("Audio deleted successfully:", filePath);
            } catch (err) {
              console.error("Error deleting audio:", err);
            }
          })
        );
      }

      const deletedJobExample = await JobExample.deleteOne({
        _id: jobExampleId,
      });
      if (deletedJobExample && obtainedJobExample) {
        this.handleSuccess(
          res,
          deletedJobExample,
          res.__("job_example_deleted_successfully", { jobTitle })
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const jobExampleId = req.params.id;
      const userLanguage = req.headers["accept-language"] || "en";
      const { launchPeriod, linkToUrl } = req.body;

      if (!launchPeriod) {
        throw createValidationError(res.__("validation_error"), [
          res.__("launchPeriod_required"),
        ]);
      }

      if (!/^\d{4}\/(0[1-9]|1[0-2])$/.test(launchPeriod)) {
        throw createValidationError(res.__("validation_error"), [
          res.__("invalid_format_launch_period", { launchPeriod }),
        ]);
      }

      if (linkToUrl && !isValidUrl(linkToUrl)) {
        throw createValidationError(res.__("validation_error"), [
          res.__("invalid_url_format", { linkToUrl }),
        ]);
      }

      const obtainedJobExample = await JobExample.findById(
        jobExampleId
      ).populate({
        path: "versions",
        match: { language: userLanguage },
        select: "language title info technologies customer category",
      });

      if (!obtainedJobExample) {
        throw createDocumentNotFoundError(
          res.__("job_example_not_found", { jobExampleId })
        );
      }

      obtainedJobExample.launchPeriod = launchPeriod;
      obtainedJobExample.linkToUrl = linkToUrl;

      if (req.files) {
        const files = Object.assign({}, req.files) as {
          [key: string]: Express.Multer.File[];
        };

        if (files.pictures && obtainedJobExample.pictures) {
          const imagesFilePath = path.join(__dirname, "../../uploads/image");
          const thumbnailsFilePath = path.join(imagesFilePath, "thumbnails");

          await Promise.all(
            obtainedJobExample.pictures.map(async (picture: string) => {
              const imgFilePath = path.join(imagesFilePath, picture);
              const thumbFilePath = path.join(
                thumbnailsFilePath,
                "thumbnail_" + picture
              );

              try {
                await fs.remove(imgFilePath);
                console.log("Image deleted successfully:", imgFilePath);
              } catch (err) {
                console.error("Error deleting image:", err);
              }

              try {
                await fs.remove(thumbFilePath);
                console.log("Thumbnail deleted successfully:", thumbFilePath);
              } catch (err) {
                console.error("Error deleting thumbnail:", err);
              }
            })
          );

          obtainedJobExample.pictures = files.pictures.map(
            (file) => file.filename
          );

          obtainedJobExample.pictures.forEach(async (picture: string) => {
            const filePath = path.join(imagesFilePath, picture);
            try {
              const result = await resizeImage(filePath);
              console.log("Job example gets: ", result);
            } catch (error) {
              console.log("Error resizing images: ", error);
            }
          });
        }

        if (files.videos) {
          await Promise.all(
            (obtainedJobExample as any).videos.map(async (video: string) => {
              const filePath = path.join(
                __dirname,
                "../../uploads/video",
                video
              );
              try {
                await fs.remove(filePath);
                console.log("Video deleted successfully:", filePath);
              } catch (err) {
                console.error("Error deleting video:", err);
              }
            })
          );
          obtainedJobExample.videos = files.videos.map((file) => file.filename);
        }

        if (files.audios) {
          await Promise.all(
            (obtainedJobExample as any).audios.map(async (audio: string) => {
              const filePath = path.join(
                __dirname,
                "../../uploads/audio",
                audio
              );
              try {
                await fs.remove(filePath);
                console.log("Audio deleted successfully:", filePath);
              } catch (err) {
                console.error("Error deleting audio:", err);
              }
            })
          );
          obtainedJobExample.audios = files.audios.map((file) => file.filename);
        }
      }

      const updatedJobExample = await obtainedJobExample.save();
      this.handleSuccess(
        res,
        updatedJobExample,
        res.__("job_updated_successfully")
      );
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new JobExampleController();
