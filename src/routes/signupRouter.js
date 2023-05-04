const express = require("express");

const signupController = require(`${__dirname}/../controllers/signupController`);

const router = express.Router();

// router
//   .route("/")
//   .get(signupController.createHTML)
//   .post(signupController.checkUserInput, signupController.login);
router.get("/", (req, res) => {
    res.render("signup");
  });

module.exports = router;
