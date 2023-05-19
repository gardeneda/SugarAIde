const express = require('express');

const validation = require(`${__dirname}/../utils/validation`);
const dietTrackController = require(`${__dirname}/../controllers/dietTrackController`);

const router = express.Router();

router.route('/')
    .get(validation.checkValidSession, dietTrackController.createHTML)

module.exports = router;