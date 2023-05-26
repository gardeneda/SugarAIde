const path = require('path');
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

exports.checkCalories = async (req, res) => {

    const email = req.session.email;

    const user = await userCollection.findOne({ email: email });

    res.render("checkCalories", { activity: user?.healthinfo?.activity });
};

exports.createHTML = (req, res) => {
  res.render(path.join(__dirname, '..', 'views', 'dietTrack'), { title: 'Diet Tracker' });
};
