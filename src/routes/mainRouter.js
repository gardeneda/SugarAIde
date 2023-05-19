const express = require("express");
const validation = require(`${__dirname}/../utils/validation`);

const mainController = require(`${__dirname}/../controllers/mainController`);

const router = express.Router();

router
  .route("/")
  .get(mainController.createHTML);
  
router
  .route('/exerciseData')
  .get(validation.checkValidSession, mainController.getExerciseData);

module.exports = router;