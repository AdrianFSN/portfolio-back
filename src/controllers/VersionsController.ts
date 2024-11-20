import { Request, Response } from "express";
import LocalizedJobExample from "../models/LocalizedJobExample.js";
import CustomError from "../types/CustomErrors.js";
import BaseController from "./BaseController.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import { LOCALIZABLE_LANGUAGES } from "../utils/constants.js";
import { InterfaceVersionData } from "../types/InterfaceVersionData.js";
import createCustomError from "../utils/createCustomError.js";

class LanguageversionController extends BaseController {
  constructor() {
    super();
    this.update = this.update.bind(this);
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { language, title, technologies, info, customer, versionId } =
        req.body;
      const validLanguages = LOCALIZABLE_LANGUAGES;

      if (!validLanguages.includes(language)) {
        throw createCustomError(res.__("language_not_valid"));
      }

      const version = await LocalizedJobExample.findById(versionId);

      if (!version) {
        throw createDocumentNotFoundError(res.__("document_not_found"));
      }

      const newJobExampleData = {
        title,
        technologies,
        info,
        customer,
      } as InterfaceVersionData;

      if (language === version.language) {
        version.title = newJobExampleData.title;
        version.technologies = newJobExampleData.technologies;
        version.info = newJobExampleData.info;
        version.customer = newJobExampleData.customer;

        await version.save();

        this.handleSuccess(
          res,
          version,
          res.__("job_example_version_updated", { language })
        );
      } else {
        throw createCustomError(res.__("wrong_language_for_version"));
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new LanguageversionController();
