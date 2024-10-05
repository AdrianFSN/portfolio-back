import { NextFunction, Request, Response } from "express";
import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  const response: Record<string, unknown> = {
    state: "success",
    data: "This resource is not supposed to answer with any data",
    message: "Hi! You are in the index of portfolio-back!",
  };
  res.render("index", {
    state: response.state,
    data: response.data,
    message: response.message,
  });
});

export default router;
