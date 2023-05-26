const express = require("express");
const validation = require(`${__dirname}/../utils/validation`);

const mainController = require(`${__dirname}/../controllers/mainController`);
const dailyReportController = require(`${__dirname}/../controllers/dailyReportController`);
const calorieRequirement = require(`${__dirname}/../controllers/calorieRequirmentController`);
const todoController = require(`${__dirname}/../controllers/todoController`);

const router = express.Router();

router.route("/")
  .get(dailyReportController.checkFirstLoginOnMain,
    calorieRequirement.getDailyValuesOnMain,
    mainController.createHTML);
  
router.route('/exerciseData')
  .get(validation.checkValidSession,
    mainController.getExerciseData);

module.exports = router;