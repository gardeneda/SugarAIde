const express = require('express');

const validation = require(`${__dirname}/../utils/validation`);
const exerciseFormController = require(`${__dirname}/../controllers/exerciseFormController`);

const router = express.Router();
//Route to create HTML and validate the session
router.route('/')
    .get(validation.checkValidSession, exerciseFormController.createHTML);

//Route to create the HTML and process the form
router.route('/form')
    .get(exerciseFormController.createHTML)
    .post(exerciseFormController.processForm);



module.exports = router;