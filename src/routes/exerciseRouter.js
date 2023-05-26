
const express = require('express');
const validation = require(`${__dirname}/../utils/validation`);
const exerciseController = require(`${__dirname}/../controllers/exerciseController`);
const router = express.Router();

//Route to create HTML
router.route('/')
    .get(validation.checkValidSession, exerciseController.createHTML)
//Route to get data
router.route('/calendarData')
    .get(exerciseController.getCalendarData);
//Route to delete data
router.delete('/calendarData/:id', exerciseController.deleteExerciseData);
//Route to update data
router.put('/calendarData/:id', exerciseController.updateExerciseData);


module.exports = router;

   