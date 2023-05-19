const express = require("express");
const validation = require(`${__dirname}/../utils/validation`);

const mainController = require(`${__dirname}/../controllers/mainController`);

const router = express.Router();

router
  .route("/")
  .get(mainController.checkCookie, mainController.createHTML);
  
router
  .route('/exerciseData')
  .get(mainController.checkCookie, mainController.getExerciseData);

module.exports = router;