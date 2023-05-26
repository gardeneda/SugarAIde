const express = require("express");
const validation = require(`${__dirname}/../utils/validation`);

const mainController = require(`${__dirname}/../controllers/mainController`);
const dailyReportController = require(`${__dirname}/../controllers/dailyReportController`);
const calorieRequirement = require(`${__dirname}/../controllers/calorieRequirmentController`);

const router = express.Router();

router.route("/")
  .get(dailyReportController.checkFirstLoginOnMain,
    calorieRequirement.getDailyValues,
    mainController.createHTML);
  
router.route('/exerciseData')
  .get(validation.checkValidSession,
    mainController.getExerciseData);

module.exports = router;