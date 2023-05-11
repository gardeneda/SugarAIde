const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const Joi = require("joi");
const express = require('express');
const bcrypt = require("bcrypt");
const app = express();
app.set('view engine', 'ejs');


exports.createHTML = (req, res) => {
    res.render('exercisePage')
};

exports.renderCalendar = async (req, res) => {
    const userEmail = req.session.email;
    const user = await userCollection.findOne({ email: userEmail });
    const events = user.cardioVascinfo.concat(user.weightLiftinginfo);

    res.render("calendar", { events });
};
