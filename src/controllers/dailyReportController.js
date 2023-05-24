// TODO: Create nurtrition and exercise data today.
// TODO: Find a way to pull data from nutritionLog and exerciseLog for yesterday

/* ///////////////////////////////////////////////// */
/*  Required Packages and Constant Declaration */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
	.db(process.env.MONGODB_DATABASE)
	.collection("users");

const dateFormatter = require(`${__dirname}/../utils/dateFormatter`);
const healthInfoController = require(`${__dirname}/healthInfoController`);
const riskAssessController = require(`${__dirname}/riskAssessController`);

/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

/**
 * Gets all of the exercise that the user at on the specific date
 * 
 * @param {Express.Request} account user's email
 * @param {String} date the specified date
 * @returns {Array} array of exercises that the user did on a specific date
 */
exports.getExercisesByDate = async (account, date) => {
  const pipeline = [
    {
      $match: {
        email: account
      }
    },
    {
      $unwind: "$exerciseLog"
    },
    {
      $match: {
        "exerciseLog.date_real": date
      }
    },
    {
      $project: {
        _id: 0,
        exerciseLog: 1
      }
    }
  ];

  const result = await userCollection.aggregate(pipeline).toArray();

  if (result.length > 0) {
    const exercises = result.map((item) => item.exerciseLog);
    return exercises;

  } else {
    return [];
  }
}

/**
 * Gets all of the food that the user at on the specific date
 * 
 * @param {Express.Request} account the user's email
 * @param {String} date the specified date
 * @returns {Array} array of food that the user ate
 */
exports.getNutrientsByDate = async (account, date) => {
  const pipeline = [
    {
      $match: {
        email: account
      }
    },
    {
      $unwind: "$nutritionLog"
    },
    {
      $match: {
        "nutritionLog.date_real": date
      }
    },
    {
      $project: {
        _id: 0,
        nutritionLog: 1  // Corrected field name
      }
    }
  ];

  const result = await userCollection.aggregate(pipeline).toArray();

  if (result.length > 0) {
    const nutritions = result.map((item) => item.nutritionLog);
    return nutritions;
  } else {
    return [];
  }
}

/**
 * Retrieves the health information of the user.
 * 
 * @param {Express.Request} account the user's email
 * @returns the user's health information
 */
exports.getHealthInfo = async (account) => {
  const user = await userCollection.findOne({ email: account });

  return user.healthinfo;
}

exports.getCaloriesConsumed = async (account) => {
  const date = dateFormatter.getToday();
  const nutrientList = await exports.getNutrientsByDate(account, date);
  let consumed = 0;
  
  for (const nutrients of nutrientList) {
    consumed += Number(nutrients.calories);
  }

  return consumed;
}

/**
 * 
 * 
 * @param {Express.Request} account the user's email
 * @param {Number} metabolism 
 * @returns the total calories burnt from exercise and daily metabolism
 */
exports.getCaloriesBurned = async (account, metabolism) => {
  const date = dateFormatter.getToday();
  const exerciseList = await exports.getExercisesByDate(account, date);
  let burned = Number(metabolism);

  for (const exercises of exerciseList) {
    burned += Number(exercises.caloriesBurned);
  }

  return burned;
}

exports.totalCalories = async (account, metabolism) => {
  const consumed = await exports.getCaloriesConsumed(account);
  const expenditure = await exports.getCaloriesBurned(account, metabolism);

  return consumed - expenditure;
}

exports.bloodGlucoseCalculator = async (account, bloodglucose) => {
  // Research shows that each 1 gram of sugar increases the blood glucose level by 5 mg/dl
  // Research also shows that the average blood glucose level is 70 ~ 100 mg/dl
  let bloodglucoseLevel = 0;

  if (bloodglucose > 0) {
    bloodglucoseLevel = bloodglucose;

  } else {
    // Maximized the blood glucose level as it makes sense that we intentionally give the 
    // biggest probability to create sufficient room for prevention of diabetes
    // if the user does not know their own blood glucose level.
    bloodglucoseLevel = 100;
  }

  let sugar = 0;

  const nutrientList = await exports.getNutrientsByDate(account, dateFormatter.getToday());
  
  for (const nutrients of nutrientList) {
    let sugarRaw = nutrients?.sugar;
    if (sugarRaw != undefined) {
      let sugarFormatted = sugarRaw.replace(/\D/g, '');
      sugar += Number(sugarFormatted);
    }
  }
  console.log(`This is the sugar level: `, sugar);
  const sugarToBloodGlucose = sugar * 5;

  bloodglucoseLevel += sugarToBloodGlucose;

  return bloodglucoseLevel;
}

exports.updateRiskAssessment = async (bloodglucose, account, healthinfo) => {
  console.log("Risk Level Before: ", healthinfo?.risk);

  const risk = riskAssessController.diabProbability(healthinfo?.age, healthinfo?.bmi, healthinfo?.highchol,
    healthinfo?.smoker, healthinfo?.stroke, healthinfo?.fruit,
    healthinfo?.veggie, healthinfo?.hvyalcohol, healthinfo?.menthlth,
    healthinfo?.physhlth, healthinfo?.hypertension, healthinfo?.heartdisease,
    healthinfo?.HbA1c, bloodglucose)
  
    // Use the dot notation for subcollections.
    userCollection.updateOne({ email: account }, {
      $set: { "healthinfo.risk": risk }
    });

    const formattedRisk = (risk.toFixed(3) * 100);

  console.log(`Risk Level After:`, risk);
  console.log(`Formatted Risk Level to Proper Decimals`, formattedRisk);
}


exports.test = async (req, res, next) => {

  const health = await exports.getHealthInfo(req.session.email);

  const calories = await exports.totalCalories(req.session.email, health.metabolism);
  console.log(`This is the total calories:`, calories);

  const bloodglucoseLevel = await exports.bloodGlucoseCalculator(req.session.email, health?.bloodglucose);
  console.log(`This is the blood glucose level:`, bloodglucoseLevel);
  
  await exports.updateRiskAssessment(bloodglucoseLevel, req.session.email, health);

  next();
}

/**
 * Renders the daily report page
 */
exports.createHTML = (req, res, next) => {
  res.render("dailyReport");
}