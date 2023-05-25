/* ///////////////////////////////////////////////// */
/*  Required Packages and Constant Declaration */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */
/*
    Send the user client the main landing page after you log-in.
    Attaches a random picture when signed in.
*/
exports.createHTML = async (req, res, next) => {
  var email = req.session.email;

  console.log("Email:", email);
  const user = await userCollection.findOne({ email: email });
  if (!user) {
    return res.send("User not found");
  }

  const dailyValues = user.dailyValues;
  if (!dailyValues) {
    res.render('main', {
      message: "No daily values inputted for today",
      username: user.username,
      tdee: 0,
      sugarLimit: 0,
      carbsLimit : 0,
      fatsLimit: 0,
      proteinsLimit: 0,
      totalCalories: 0,
      totalFat: 0,
      totalCarbs: 0,
      totalSugar: 0,
      totalProtein: 0,
      remainingCal: 0
    });
    return;
  }

  const tdee = (user.healthinfo?.tdee ?? 0 ).toFixed(0);

  // Extract values from the dailyValues object
  const {
    sugarLimit,
    carbsLimit,
    fatsLimit,
    proteinsLimit,
    totalCalories = 0,
    totalFat = 0,
    totalCarbs = 0,
    totalSugar = 0,
    totalProtein = 0
  } = dailyValues;
  

  // Render the profile view with the user data and dailyValues

  res.render('main', { 
    username: user.username,
    tdee: tdee ? tdee : null, 
    sugarLimit: sugarLimit, 
    carbsLimit : carbsLimit, 
    fatsLimit: fatsLimit, 
    proteinsLimit: proteinsLimit,
    totalCalories: totalCalories,
    totalFat: totalFat,
    totalCarbs: totalCarbs,
    totalSugar: totalSugar,
    totalProtein: totalProtein,
    remainingCal: tdee - totalCalories
  });
}


//Gets exerciselog data from the user 
exports.getExerciseData = async (req, res, next) => {
  const userEmail = req.session.email;
  const user = await userCollection.findOne({ email: userEmail });
  const exerciseLog = user.exerciseLog;
  res.json({ exercise: exerciseLog });
};

//Gets dailyValues data from the user
exports.getDailyValues = async (req, res, next) => {

  const email = req.session.email;
  const user = await userCollection.findOne({ email: email });
  if (!user) {
    res.render('main', {
      message: "User not found"
    });
  }

  const dailyValues = user.dailyValues;

  if (!dailyValues) {
    res.render('main', {
      message: "No daily values found"
    });
  }
  
  res.json({ dailyValues: dailyValues });
};