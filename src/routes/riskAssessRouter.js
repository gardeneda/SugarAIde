const express = require('express');

const riskAssessController = require(`${__dirname}/../controllers/riskAssessController`);

const router = express.Router();

router.route('/')
    .get(riskAssessController.createHTML);


module.exports = router;