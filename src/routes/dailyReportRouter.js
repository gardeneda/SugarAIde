const express = require('express');

const validation = require(`${__dirname}/../utils/validation`);
const dailyReportController = require(`${__dirname}/../controllers/dailyReportController`);

const router = express.Router();

router.route('/')
    .get(validation.checkValidSession,
        // dailyReportController.checkFirstLoginDay,
        dailyReportController.createHTML);

module.exports = router;