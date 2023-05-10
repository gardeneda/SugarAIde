const express = require('express');

const chatController = require(`${__dirname}/../controllers/chatController`);

const router = express.Router();

router.route('/').get(chatController.createHTML);

module.exports = router;