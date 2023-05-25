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

exports.getUserNutritionData = async (req, res, next) => {
  try {
    const email = req.session.email;
    const user = await userCollection.findOne({ email: email });

    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    let days = {
      'Sun': { totalCalories: 0 },
      'Mon': { totalCalories: 0 },
      'Tue': { totalCalories: 0 },
      'Wed': { totalCalories: 0 },
      'Thu': { totalCalories: 0 },
      'Fri': { totalCalories: 0 },
      'Sat': { totalCalories: 0 },
    };
    
    // Iterate over each key in nutritionLog
    for (let key in user.nutritionLog) {
      // Get the day of the week from the log's date
      let date = new Date(user.nutritionLog[key].date);
      let dayOfWeek = date.toLocaleString('en-us', { weekday: 'short' });

      // Add the calories to the total for the day of the week
      days[dayOfWeek].totalCalories += Number(user.nutritionLog[key].calories);
    }

    return res.render('foodHistory', { days });

  } catch (err) {
    console.error(err);
    return res.status(500).render('error', { message: 'Server error' });
  }
};

exports.createHTML = async (req, res) => {
  try {
      const email = req.session.email;
      const user = await userCollection.findOne({ email: email });

      if (!user || !user.nutritionLog) {
          return res.render('foodHistory', {
              days: []
          });
      }
        const days = Object.entries(user.nutritionLog).map(([day, meal]) => ({ day, ...meal }));

      res.render('foodHistory', { days });
  } catch (err) {
      console.error(err);
      res.render('foodHistory', {
          days: []
      });
  }
};

exports.getFoodData = async (req, res) => {
  try {
    const day = req.query.day;
    const email = req.session.email;
    const user = await userCollection.findOne({ email: email });

    console.log('User:', user); // Debug line

    if (!user || !user.nutritionLog) {
      return res.json({ foodData: [] });
    }

    // Filter nutritionLog entries by day
    const foodData = user.nutritionLog.filter(entry => {
      console.log('Entry:', entry); // Debug line
      const entryDate = new Date(entry.date);
      const entryDay = entryDate.toLocaleString('en-us', { weekday: 'short' });
      console.log('Entry day:', entryDay); // Debug line

      // Compare the parsed day with the day from the query
      return entryDay === day;
    });

    console.log('Filtered food data:', foodData); // Debug line

    return res.json({foodData:foodData});

  } catch (err) {
    console.error(err);
    res.json({ foodData: [] });
  }
};

exports.deleteFoodDataByNameAndDate = async function (req, res) {
  const { food, date } = req.query;
  const email = req.session.email; 
  const user = await userCollection.findOne({ email: email });
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Convert date string back to a Date object
  const dateObject = new Date(date);

  // Find and delete the entry from nutritionLog
  user.nutritionLog = user.nutritionLog.filter(entry => {
    const entryDate = new Date(entry.date);
    return !(entry.food === food && entryDate.getTime() === dateObject.getTime());
  });

  // update the user in the database
  await userCollection.updateOne({ email: email }, { $set: { nutritionLog: user.nutritionLog } });

  res.status(200).send({ message: 'Food data successfully deleted.' });
};




