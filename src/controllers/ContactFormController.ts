import { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import CustomError, { DocumentNotFound } from "../types/CustomErrors.js";
import BaseController from "./BaseController.js";
import createValidationError from "../utils/createValidationError.js";
import createDocumentNotFoundError from "../utils/createDocumentNotFoundError.js";
import { VALID_CATEGORIES } from "../utils/constants.js";
import isValidCategory from "../utils/validCategory.js";
import isValidEmail from "../utils/validEmailChecker.js";
import receivedMessage from "../models/ContactForm.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class JobExampleController extends BaseController {
  constructor() {
    super();
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.getOneMessage = this.getOneMessage.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, content, opt_in, subject } = req.body;

      if (!name || !email || !content) {
        throw createValidationError(res.__("validation_error"), [
          res.__("required_fields_for_contact_form"),
        ]);
      }

      if (email && !isValidEmail(email)) {
        throw createValidationError(res.__("validation_error"), [
          res.__("invalid_email_format", { email }),
        ]);
      }

      if (!opt_in) {
        throw createValidationError(res.__("validation_error"), [
          res.__("accept_saving_data"),
        ]);
      }

      if (subject && !isValidCategory(subject, VALID_CATEGORIES)) {
        throw createValidationError(res.__("validation_error"), [
          res.__("invalid_category", { subject }),
        ]);
      }

      const newMessageData = {
        name: req.body.name,
        email: req.body.email,
        content: req.body.content,
        subject: req.body.subject,
        opt_in: req.body.opt_in,
      };

      const newMessage = new receivedMessage(newMessageData).save();

      this.handleSuccess(
        res,
        newMessage,
        res.__("message_received_successfully")
      );
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      let filters: any = {};

      if (req.query.hasOwnProperty("subject")) {
        if (Array.isArray(req.query.subject)) {
          filters.subject = { $in: req.query.subject };
        } else if (typeof req.query.subject === "string") {
          filters.subject = req.query.subject;
        }
      }

      if (
        req.query.hasOwnProperty("name") &&
        typeof req.query.name === "string"
      ) {
        filters.name = req.query.name;
      }

      if (
        req.query.hasOwnProperty("email") &&
        typeof req.query.email === "string"
      ) {
        filters.email = req.query.email;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const sortField = (req.query.sort as string) || "createdAt";
      const sortOrder = req.query.order === "desc" ? -1 : 1;

      const messagesList = await receivedMessage
        .find(filters)
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder });
      const totalMessages = await receivedMessage.countDocuments(filters);
      const totalPages = Math.ceil(totalMessages / limit);

      if (messagesList) {
        this.handleSuccess(
          res,
          {
            totalMessages,
            totalPages,
            currentPage: page,
            messagesList,
          },
          messagesList.length > 0
            ? res.__("received_messages_list_loaded")
            : res.__("received_messages_list_empty")
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }

  async getOneMessage(req: Request, res: Response): Promise<void> {
    const messageId = req.params.id;
    try {
      const obtainedMessage = await receivedMessage.findById(messageId);

      if (obtainedMessage) {
        this.handleSuccess(
          res,
          obtainedMessage,
          res.__("received_message_loaded_successfully")
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
      const messageId = req.params.id;
      const obtainedMessage = await receivedMessage.findById(messageId);

      if (!obtainedMessage) {
        throw createDocumentNotFoundError(
          res.__("received_message_not_found", { messageId })
        );
      }

      const deletedMessage = await receivedMessage.deleteOne({
        _id: messageId,
      });
      if (deletedMessage && obtainedMessage) {
        this.handleSuccess(
          res,
          deletedMessage,
          res.__("received_message_deleted_successfully")
        );
      }
    } catch (error) {
      this.handleError(error as CustomError, res);
    }
  }
}

export default new JobExampleController();
