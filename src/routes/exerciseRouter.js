const express = require('express');

const exerciseController = require(`${__dirname}/../controllers/exerciseController`);

const router = express.Router();

router.route('/')
    .get(exerciseController.createHTML);


module.exports = router;