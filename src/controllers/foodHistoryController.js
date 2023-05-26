// ///////////////////////////////////////////////// //
//  Required Packages and Constant Declaration
const dotenv = require("dotenv");
const express = require('express');
const app = express();
const database = require(`${__dirname}/../config/databaseConfig`);

// Load environment variables
dotenv.config({ path: "./.env" });

// Set the view engine to EJS for rendering views
app.set('view engine', 'ejs');

// Connect to the database
const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");
// End of Required Packages and Constant Declaration
// ///////////////////////////////////////////////// //

// Fetch user's nutrition data
exports.getUserNutritionData = async (req, res, next) => {
  try {
    const email = req.session.email;
    const user = await userCollection.findOne({ email: email });

    // If the user does not exist, render the error page
    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    // Initialize a dictionary for days of the week
    let days = {
      'Sun': { totalCalories: 0 },
      'Mon': { totalCalories: 0 },
      'Tue': { totalCalories: 0 },
      'Wed': { totalCalories: 0 },
      'Thu': { totalCalories: 0 },
      'Fri': { totalCalories: 0 },
      'Sat': { totalCalories: 0 },
    };
    
    // Accumulate total calories for each day
    for (let key in user.nutritionLog) {
      let date = new Date(user.nutritionLog[key].date);
      let dayOfWeek = date.toLocaleString('en-us', { weekday: 'short' });
      days[dayOfWeek].totalCalories += Number(user.nutritionLog[key].calories);
    }

    // Render the foodHistory page with accumulated data
    return res.render('foodHistory', { days });
  } catch (err) {
    console.error(err);
    return res.status(500).render('error', { message: 'Server error' });
  }
};

// Render the HTML page with user's nutrition data
exports.createHTML = async (req, res) => {
  try {
      const email = req.session.email;
      const user = await userCollection.findOne({ email: email });

      if (!user || !user.nutritionLog) {
          return res.render('foodHistory', { days: [] });
      }

      // Map the nutrition log to a list of day and meal pairs
      const days = Object.entries(user.nutritionLog).map(([day, meal]) => ({ day, ...meal }));

      // Render the foodHistory page with nutrition data
      res.render('foodHistory', { days });
  } catch (err) {
      console.error(err);
      res.render('foodHistory', { days: [] });
  }
};

// Fetch food data for a specific day
exports.getFoodData = async (req, res) => {
  try {
    const day = req.query.day;
    const email = req.session.email;
    const user = await userCollection.findOne({ email: email });

    if (!user || !user.nutritionLog) {
      return res.json({ foodData: [] });
    }

    // Filter the nutrition log entries by day
    const foodData = user.nutritionLog.filter(entry => {
      const entryDate = new Date(entry.date);
      const entryDay = entryDate.toLocaleString('en-us', { weekday: 'short' });

      // If the entry's day matches the requested day, keep the entry
      return entryDay === day;
    });

    // Return the filtered food data
    return res.json({foodData:foodData});
  } catch (err) {
    console.error(err);
    res.json({ foodData: [] });
  }
};

// Delete food data by food name and date
exports.deleteFoodDataByNameAndDate = async function (req, res) {
  const { food, date } = req.query;
  const email = req.session.email; 
  const user = await userCollection.findOne({ email: email });
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Convert the date string back to a Date object
  const dateObject = new Date(date);

  // Filter out the nutrition log entry that matches the food name and date
  user.nutritionLog = user.nutritionLog.filter(entry => {
    const entryDate = new Date(entry.date);
    return !(entry.food === food && entryDate.getTime() === dateObject.getTime());
  });

  // Update the user in the database with the new nutrition log
  await userCollection.updateOne({ email: email }, { $set: { nutritionLog: user.nutritionLog } });

  // Respond with a success message
  res.status(200).send({ message: 'Food data successfully deleted.' });
};
