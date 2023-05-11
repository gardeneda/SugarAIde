const express = require("express");

const validation = require(`${__dirname}/../utils/validation`);
const riskAssessController = require(`${__dirname}/../controllers/riskAssessController`);

const router = express.Router();

router
  .route("/")
  .get(validation.checkValidSession, riskAssessController.createHTML);

module.exports = router;
