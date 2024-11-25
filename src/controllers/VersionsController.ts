import { Request, Response } from "express";
import LocalizedJobExample from "../models/LocalizedJobExample.js";
import CustomError from "../types/CustomErrors.js";
import BaseController from "./BaseController.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import { LOCALIZABLE_LANGUAGES } from "../utils/constants.js";
import { InterfaceVersionData } from "../types/InterfaceVersionData.js";
import createCustomError from "../utils/createCustomError.js";
import createValidationError from "../utils/createValidationError.js";

class LanguageversionController extends BaseController {
  constructor() {
    super();
    this.update = this.update.bind(this);
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const {
        language,
        title,
        technologies,
        info,
        description,
        customer,
        versionId,
      } = req.body;
      const validLanguages = LOCALIZABLE_LANGUAGES;

      if (!validLanguages.includes(language)) {
        throw createValidationError(res.__("validation_error"), [
          res.__("language_not_valid"),
        ]);
      }

      const version = await LocalizedJobExample.findById(versionId);

      if (!version) {
        throw createDocumentNotFoundError(res.__("document_not_found"));
      }

      const newJobExampleData = {
        title,
        technologies,
        info,
        description,
        customer,
      } as InterfaceVersionData;

      if (language === version.language) {
        version.title = newJobExampleData.title;
        version.technologies = newJobExampleData.technologies;
        version.info = newJobExampleData.info;
        version.description = newJobExampleData.description;
        version.customer = newJobExampleData.customer;

        await version.save();

        this.handleSuccess(
          res,
          version,
          res.__("job_example_version_updated", { language })
        );
      } else {
        throw createValidationError(res.__("validation_error"), [
          res.__("wrong_language_for_version"),
        ]);
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new LanguageversionController();
