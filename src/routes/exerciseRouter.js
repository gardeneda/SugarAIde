
const express = require('express');
const validation = require(`${__dirname}/../utils/validation`);
const exerciseController = require(`${__dirname}/../controllers/exerciseController`);
const router = express.Router();


router.route('/')
    .get(validation.checkValidSession, exerciseController.createHTML)

router.route('/calendarData')
    .get(exerciseController.getCalendarData);

router.delete('/calendarData/:id', exerciseController.deleteExerciseData);

router.put('/calendarData/:id', exerciseController.updateExerciseData);


module.exports = router;

   