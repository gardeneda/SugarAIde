const express = require("express");

const validation = require(`${__dirname}/../utils/validation`);
const foodHistoryController = require(`${__dirname}/../controllers/foodHistoryController`);

const router = express.Router();

router
  .route("/")
  .get(validation.checkValidSession, foodHistoryController.createHTML);

module.exports = router;