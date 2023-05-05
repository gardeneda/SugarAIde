const express = require("express");

const mainController = require(`${__dirname}/../controllers/mainController`);

const router = express.Router();

router
  .route("/")
  .get(mainController.checkCookie, mainController.createHTML);

module.exports = router;