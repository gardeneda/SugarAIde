
const express = require('express');
const validation = require(`${__dirname}/../utils/validation`);
const exerciseController = require(`${__dirname}/../controllers/exerciseController`);
const router = express.Router();


router.route('/')
    .get(validation.checkValidSession, exerciseController.createHTML)

router.route('/calendarData')
    .get(exerciseController.getCalendarData);

module.exports = router;

   

