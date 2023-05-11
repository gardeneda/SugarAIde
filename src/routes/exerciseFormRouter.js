const express = require('express');

const exerciseFormController = require(`${__dirname}/../controllers/exerciseFormController`);

const router = express.Router();

router.route('/')
    .get(exerciseFormController.createHTML);


module.exports = router;