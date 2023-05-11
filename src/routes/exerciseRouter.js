const express = require('express');
const exerciseController = require(`${__dirname}/../controllers/exerciseController`);
const router = express.Router();

router.route('/')
    .get(exerciseController.createHTML);

router.get("/calendar", exerciseController.renderCalendar);

module.exports = router;
