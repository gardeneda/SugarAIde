const express = require("express");

const loginController = require(`${__dirname}/../controllers/loginController`);

const router = express.Router();

router
  .route("/")
  .get(loginController.createHTML)
  .post(loginController.checkUserInput, loginController.login);

module.exports = router;