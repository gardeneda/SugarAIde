
const express = require('express');
const exerciseController = require(`${__dirname}/../controllers/exerciseController`);
const router = express.Router();

router.get('/', exerciseController.createHTML);
router.get('/calendarData', exerciseController.getCalendarData); 

module.exports = router;

   

