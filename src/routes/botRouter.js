const express = require('express');

const botController = require(`${__dirname}/../controllers/botController`);

const router = express.Router();

router.route('/')
    .post(botController.getAllThings);

module.exports = router;