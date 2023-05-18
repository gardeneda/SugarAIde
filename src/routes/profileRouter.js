const express = require('express');

const validation = require(`${__dirname}/../utils/validation`);
const profileController = require(`${__dirname}/../controllers/profileController`);

const router = express.Router();

router.route('/')
    .get(validation.checkValidSession, profileController.createHTML);

    router.route('/updateHealthInfo')
    .post(profileController.updateHealthInfo);    

module.exports = router;