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


//For placeholder chart (calories/sugar) 
// exports.createHTML = (req, res) => {
//   res.render('foodHistory');
// };

// exports.getUserNutritionData = async (req, res, next) => {
//   try {
//     const email = req.session.email;
//     const user = await userCollection.findOne({ email: email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     return res.status(200).json(user.nutritionLog);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

exports.getUserNutritionData = async (req, res, next) => {
  try {
    const email = req.session.email;
    const user = await userCollection.findOne({ email: email });

    if (!user) {
      return res.status(404).render('error', { message: 'User not found' });
    }

    // create arrays for each nutrition category
    let caloriesArray = [];
    let sugarArray = [];
    let proteinArray = [];

    // loop through each log in nutritionLog
    for (let log of user.nutritionLog) {
      // push the respective nutrition value into its array
      caloriesArray.push(log.calories);
      sugarArray.push(log.sugar);
      proteinArray.push(log.protein);
    }

    // render the data on foodHistory view
    return res.render('foodHistory', { 
      calories: caloriesArray, 
      sugar: sugarArray, 
      protein: proteinArray 
    });

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
  
      // Assuming nutritionLog is now an object where keys are days of the week and values are the meals
      const days = Object.entries(user.nutritionLog).map(([day, meal]) => ({ day, ...meal }));

      res.render('foodHistory', { days });
  } catch (err) {
      console.error(err);
      res.render('foodHistory', {
          days: []
      });
  }
};




