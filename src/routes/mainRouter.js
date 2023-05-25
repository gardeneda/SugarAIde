const express = require("express");
const validation = require(`${__dirname}/../utils/validation`);

const mainController = require(`${__dirname}/../controllers/mainController`);
const todoController = require(`${__dirname}/../controllers/todoController`);

const router = express.Router();

router
  .route("/")
  .get(validation.checkValidSession, mainController.createHTML);
  
router
  .route('/exerciseData')
  .get(validation.checkValidSession, mainController.getExerciseData);

module.exports = router;