const express = require("express");

const signupController = require(`${__dirname}/../controllers/signupController`);

const router = express.Router();

router
  .route("/")
  .get(signupController.createHTML)
  .post(
    signupController.checkInput,
    signupController.checkDuplicate,
    signupController.createUser
  );

module.exports = router;
