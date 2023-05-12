const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const database = require(`${__dirname}/../config/databaseConfig`);

const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");
    


exports.createHTML = (req, res) => {
    res.render('exercisePage')
};
exports.getCalendarData = async (req, res, next) => {
    const userEmail = req.session.email;
    const user = await userCollection.findOne({ email: userEmail });
    const exerciseLog = user.exerciseLog;
    res.json({exercise: exerciseLog });
  };
  
