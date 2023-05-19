const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

exports.createHTML = async (req, res, next) => {

        var email = req.session.email;

        // Find the user with the given username
        const user = await userCollection.findOne({ email: email });

        if (!user) {
            res.send("User not found");
            return;
        }

        if (!user.healthinfo) {
            res.render('profile', {
                username: user.username,
                email: user.email,
                message: "No health info found."
            });
        } else {
            // Render the profile view with the user data
            res.render('profile', {
            username: user.username,
            email: user.email,
            height: user.healthinfo?.height,
            weight: user.healthinfo?.weight,
            activity: user.healthinfo?.activity,
            gender: user.healthinfo?.gender,
            age: user.healthinfo?.age,
            risk: (user.healthinfo?.risk).toFixed(1) * 100
        });
        }
        
}


exports.updateHealthInfo = async (req, res, next) => {
  var email = req.session.email;

  // Extract new weight, age, and activity from request body
  var newWeight = req.body.weight;
  var newAge = req.body.age;
  var newActivity = req.body.activity;

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

    // Update TDEE based on the new activity
    const user = await userCollection.findOne({ email: email });
    if (user && user.healthinfo && user.healthinfo.metabolism) {
      var bmr = Number(user.healthinfo.metabolism);
      var tdee;

      switch (newActivity) {
        case 'sedentary':
          tdee = bmr * 1.2;
          break;
        case 'lightly-active':
          tdee = bmr * 1.375;
          break;
        case 'moderately-active':
          tdee = bmr * 1.55;
          break;
        case 'very-active':
          tdee = bmr * 1.725;
          break;
        case 'super-active':
          tdee = bmr * 1.9;
          break;
        default:
          tdee = bmr; // Default to BMR if activity is not recognized
          break;
      }

      updateFields["healthinfo.tdee"] = tdee;
    }
  }

  // Find the user and update the weight, age, and activity
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
