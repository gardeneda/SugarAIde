const express = require("express");

const resourcesController = require(`${__dirname}/../controllers/resourcesController`);
const validation = require(`${__dirname}/../utils/validation`);
const router = express.Router();

router
  .route("/")
  .get(validation.checkValidSession, resourcesController.createHTML);

module.exports = router;