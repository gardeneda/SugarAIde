const express = require('express');

const validation = require(`${__dirname}/../utils/validation`);
const healthInfoController = require(`${__dirname}/../controllers/healthInfoController`);

const router = express.Router();

router.route('/')
    .get(validation.checkValidSession, healthInfoController.createHTML);


router.route('/form')
    .get(healthInfoController.createForm)
    .post(healthInfoController.processForm);

module.exports = router;