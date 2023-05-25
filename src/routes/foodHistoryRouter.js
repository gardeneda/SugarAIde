const express = require("express");

const validation = require(`${__dirname}/../utils/validation`);
const foodHistoryController = require(`${__dirname}/../controllers/foodHistoryController`);

const router = express.Router();

router
  .route("/")
  .get(validation.checkValidSession, foodHistoryController.createHTML);

router.delete('/foodDataByNameAndDate', foodHistoryController.deleteFoodDataByNameAndDate);

router
  .route('/foodData')
  .get(validation.checkValidSession, foodHistoryController.getFoodData);

router
  .route('/foodHistory')
  .get(validation.checkValidSession, foodHistoryController.getUserNutritionData);

module.exports = router;