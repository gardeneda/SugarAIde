const express = require("express");

const foodHistoryController = require(`${__dirname}/../controllers/foodHistoryController`);

const router = express.Router();

router
  .route("/")
  .get(foodHistoryController.checkCookie, foodHistoryController.createHTML);

module.exports = router;