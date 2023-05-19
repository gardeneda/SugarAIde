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
    res.send("User not found");
    return;
  }
  
  // Render the profile view with the user data
  console.log("Username:", user.username);

  res.render('main',{ username: user.username});
}


//Gets exerciselog data from the user 
exports.getExerciseData = async (req, res, next) => {
  const userEmail = req.session.email;
  const user = await userCollection.findOne({ email: userEmail });
  const exerciseLog = user.exerciseLog;
  res.json({ exercise: exerciseLog });
};