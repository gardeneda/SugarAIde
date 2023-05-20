const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require('express');
const bcrypt = require("bcrypt");
const app = express();
app.set('view engine', 'ejs');
const crypto = require("crypto");


const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

exports.createHTML = (req, res) => {
    res.render('exerciseForm')
};

exports.createHTML = (req, res) => {
    res.render('exerciseForm');
};


exports.processForm = async (req, res, next) => {
  const formId = req.body.formId;
  const exercise = req.body.exercise;
  const date = req.body.date;
  const notes = req.body.notes;

  let updateData;

  // Generate unique id
  const id = crypto.randomBytes(16).toString("hex");

  if (formId === 'cardiovascularForm') {
    const duration = Number(req.body.duration);
    const caloriesBurned = Number(req.body.caloriesBurned);

    updateData = {
      $push: {
        exerciseLog: {
          id: id,
          date: new Date().toString(),
          end_date: new Date().toString(),
          exercise: exercise,
          duration: duration,
          caloriesBurned: caloriesBurned,
          notes: notes
        }
      }
    };
  } else if (formId === 'weightliftingForm') {
    const weight = Number(req.body.weight);
    const sets = Number(req.body.sets);
    const reps = Number(req.body.reps);
    let duration = Number(req.body.duration);
    const calories_burned = Number(req.body.calories_burned);

    if (isNaN(duration)) {
      duration = 0;
    }
    updateData = {
      $push: {
        exerciseLog: {
          id: id,
          date: new Date().toString(),
          end_date: new Date().toString(),
          exercise: exercise,
          duration: duration,
          calories_burned: calories_burned,
          weight: weight,
          set: sets,
          reps: reps,
          notes: notes
        }
      }
    };
  } else {
    res.status(400).send('Invalid form identifier');
    return;
  }

  try {
    await userCollection.updateOne({ email: req.session.email }, updateData);
    res.status(200);
    res.redirect('/exercisePage');
  } catch (error) {
    console.error('Error processing form: ', error);
    res.status(500).send('Error processing form');
  }
};
