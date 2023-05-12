const express = require('express');

const validation = require(`${__dirname}/../utils/validation`);
const exerciseFormController = require(`${__dirname}/../controllers/exerciseFormController`);

const router = express.Router();

router.route('/')
    .get(validation.checkValidSession, exerciseFormController.createHTML);


router.route('/form')
    .get(exerciseFormController.createHTML)
    .post(exerciseFormController.processForm);



module.exports = router;