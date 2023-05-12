// routers/forgotPasswordController.js
const express = require('express');
const router = express.Router();
const forgotPasswordController = require('../controllers/forgotPasswordController');

router.route('/')
    .get(forgotPasswordController.createHTML)
    .post(forgotPasswordController.forgotPassword);

module.exports = router;

