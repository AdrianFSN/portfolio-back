var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const response = {
    state: "success",
    data: "This resource is not supposed to answer with any data",
    message: "Hi! You are in the index of portfolio-back!",
  };
  res.json(response);
});

module.exports = router;
