const express = require('express');

const healthInfoController = require(`${__dirname}/../controllers/healthInfoController`);

const router = express.Router();

router.route('/')
    .get(healthInfoController.createHTML);


router.route('/form')
    .get(healthInfoController.createForm)
    .post(healthInfoController.processForm);

module.exports = router;