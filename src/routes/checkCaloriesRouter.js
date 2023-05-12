const express = require('express');

const validation = require(`${__dirname}/../utils/validation`);
const checkCaloriesController = require(`${__dirname}/../controllers/checkCaloriesController`);

const router = express.Router();

router.route('/')
    .get(validation.checkValidSession, checkCaloriesController.createHTML)
    .post(checkCaloriesController.processForm);

module.exports = router;