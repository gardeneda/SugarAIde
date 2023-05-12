const express = require("express");

const validation = require(`${__dirname}/../utils/validation`);
const calorieRequirmentController = require(`${__dirname}/../controllers/calorieRequirmentController`);

const router = express.Router();

router
  .route("/")
  .get(validation.checkValidSession, calorieRequirmentController.createHTML);

module.exports = router;
