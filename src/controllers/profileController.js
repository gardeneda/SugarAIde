const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();
app.set("view engine", "ejs");

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");

  const diabProbabilityLifestyle = function (
    age,
    bmi,
    highchol = 0,
    smoker,
    stroke,
    fruit = 0,
    veggie = 0,
    hvyalcohol = 0,
    menthlth = 0,
    physhlth = 0
) {

    const logOdds =
        -0.397 +
        (0.0044 * age) +
        (0.0133 * bmi) +
        (0.118 * highchol) +
        (0.0167 * smoker) +
        (0.1146 * stroke) +
        (-0.016 * fruit) +
        (-0.0292 * veggie) +
        (-0.0873 * hvyalcohol) +
        (0.0009 * menthlth) +
        (0.005 * physhlth);

    const probability = 1 / (1 + Math.exp(-logOdds));

    return probability;
}

/*
  This is the formula attained from the MLR (OLS Regression) test for
  the coefficients of all of the variables linked to diabetes from
  the 'Diabetes Prediction' data set.


  NOTE: This is used for health conditions, such as hypertension,
  heart disease and blood glucose levels.

  NOTE: Log Odds is a statistical formula that finds the 'odds' of the
  dependent variable from happening.
*/
const diabProbabilityMedical = function (
    age,
    hypertension = 0,
    heartdisease = 0,
    bmi,
    HbA1c = 0,
    bloodglucose = 0
) {
    const logOdds =
        -0.8659 +
        (0.0014 * age) +
        (0.0964 * hypertension) +
        (0.12 * heartdisease) +
        (0.0043 * bmi) +
        (0.0814 * HbA1c) +
        (0.0023 * bloodglucose);

    probability = 1 / (1 + Math.exp(-logOdds));

    return probability;
}

/*
    Returns the highest probability out of the two functions of
    diabProbabilityMedical and diabProbabilityLifestyle.
*/
exports.diabProbability = function (
    age,
    bmi,
    highchol = 0,
    smoker,
    stroke,
    fruit = 0,
    veggie = 0,
    hvyalcohol = 0,
    menthlth = 0,
    physhlth = 0,
    hypertension = 0,
    heartdisease = 0,
    HbA1c = 0,
    bloodglucose = 0
) {
    a = diabProbabilityLifestyle(
        age,
        bmi,
        highchol,
        smoker,
        stroke,
        fruit,
        veggie,
        hvyalcohol,
        menthlth,
        physhlth
    );

    b = diabProbabilityMedical(
        age,
        hypertension,
        heartdisease,
        bmi,
        HbA1c,
        bloodglucose
    );

    return (a > b) ? a : b;
}

const recalculateRisk = async function (email) {
  const user = await userCollection.findOne({ email: email });

  if (!user || !user.healthinfo) {
    return;
  }

  const { weight, height, age } = user.healthinfo;

  if (!weight || !height || !age) {
    return;
  }

  const bmi = weight / (height / 100) ** 2;

  const risk = exports.diabProbability(
    age,
    bmi,
    user.healthinfo.highchol,
    user.healthinfo.smoker,
    user.healthinfo.stroke,
    user.healthinfo.fruit,
    user.healthinfo.veggie,
    user.healthinfo.hvyalcohol,
    user.healthinfo.menthlth,
    user.healthinfo.physhlth,
    user.healthinfo.hypertension,
    user.healthinfo.heartdisease,
    user.healthinfo.HbA1c,
    user.healthinfo.bloodglucose
  );

  await userCollection.updateOne(
    { email: email },
    {
      $set: { "healthinfo.risk": risk },
    }
  );
};


exports.createHTML = async (req, res, next) => {
  var email = req.session.email;

  // Find the user with the given username
  const user = await userCollection.findOne({ email: email });

  if (!user) {
    res.send("User not found");
    return;
  }

  if (!user.healthinfo) {
    res.render("profile", {
      username: user.username,
      email: user.email,
      message: "No health info found.",
    });
  } else {
    let risk = 0;
    if (user.healthinfo.risk && typeof user.healthinfo.risk === 'number') {
      risk = (user.healthinfo.risk * 100).toFixed(1);
    }

    // Set cache-control headers to disable caching
    res.set('Cache-Control', 'no-store');
    console.log("risk: " + risk)
    // Render the profile view with the user data
    res.render("profile", {
      username: user.username,
      email: user.email,
      height: user.healthinfo?.height,
      weight: user.healthinfo?.weight,
      activity: user.healthinfo?.activity,
      gender: user.healthinfo?.gender,
      age: user.healthinfo?.age,
      risk: risk,
    });
  }
};


exports.updateHealthInfo = async (req, res, next) => {
  var email = req.session.email;

  // Extract new weight, age, and activity from request body
  var newWeight = req.body.weight;
  var newAge = req.body.age;
  var newActivity = req.body.activity;

  // Find the user with the given email
  const user = await userCollection.findOne({ email: email });

  if (!user) {
    res.send("User not found");
    return;
  }

  // Update fields only if they have new values
  var updateFields = {};
  if (newWeight !== undefined) {
    updateFields["healthinfo.weight"] = newWeight;
  }
  if (newAge !== undefined) {
    updateFields["healthinfo.age"] = newAge;
  }
  if (newActivity !== undefined) {
    updateFields["healthinfo.activity"] = newActivity;
  }

  // Recalculate and update risk
  await recalculateRisk(email);

  // Update the user document with the new fields
  const result = await userCollection.updateOne(
    { email: email },
    { $set: updateFields }
  );

  if (result.modifiedCount === 0) {
    res.send("Failed to update health info");
    return;
  }

  // Send success response
  res.send("success");
};

exports.getRisk = async function (req, res, next) {
  const email = req.session.email;

  // Retrieve the user from the database
  const user = await userCollection.findOne({ email: email });

  if (!user || !user.healthinfo || !user.healthinfo.risk) {
    res.status(404).json({ error: 'Risk value not found' });
    return;
  }

  const risk = user.healthinfo.risk;
  res.json({ risk: risk });
};

