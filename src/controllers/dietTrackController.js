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
    console.log ("inside of checkCalories function")

    const email = req.session.email;

    const user = await userCollection.findOne({ email: email });

    console.log("user: " + user)

    res.render("checkCalories", { activity: user?.healthinfo?.activity });
};

exports.createHTML = (req, res) => {
  res.render(path.join(__dirname, '..', 'views', 'dietTrack'), { title: 'Diet Tracker' });
};
