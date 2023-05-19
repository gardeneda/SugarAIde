const express = require("express");

const additionalInfoController = require(`${__dirname}/../controllers/additionalInfoController`);
const validation = require(`${__dirname}/../utils/validation`);
const router = express.Router();

router
  .route("/")
  .get(validation.checkValidSession, additionalInfoController.createHTML);

module.exports = router;