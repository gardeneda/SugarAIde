const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const Joi = require("joi");
const express = require('express');
const bcrypt = require("bcrypt");
const app = express();
app.set('view engine', 'ejs');


exports.createHTML = (req, res) => {
    res.render('exerciseForm')
};
