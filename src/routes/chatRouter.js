const express = require('express');

const validation = require(`${__dirname}/../utils/validation`);
const chatController = require(`${__dirname}/../controllers/chatController`);

const router = express.Router();

router.route('/')
    .get(validation.checkValidSession, chatController.createHTML)
    .post(chatController.processUserMessage);

module.exports = router;