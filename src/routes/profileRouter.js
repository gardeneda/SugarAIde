const express = require('express');

const profileController = require(`${__dirname}/../controllers/profileController`);

const router = express.Router();

router.route('/')
    .get(profileController.createHTML);

module.exports = router;