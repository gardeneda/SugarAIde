// routers/forgotPasswordController.js
const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');

router
    .get('/:id/:token', resetPasswordController.resetPassword)
    .post('/:id/:token', resetPasswordController.updatePassword)
module.exports = router;


