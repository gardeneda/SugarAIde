// 


const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require('express');
const { date } = require("joi");
const app = express();
app.set('view engine', 'ejs');
const { MongoClient, ObjectId } = require('mongodb');
const database = require(`${__dirname}/../config/databaseConfig`);

let dbClient; // Declare a variable to store the database client

async function connectToDatabase() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("Connected to the database");
    dbClient = client; // Assign the database client to the variable
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
}

connectToDatabase(); // Call the function to establish the database connection

const userCollection = () => {
  return dbClient.db(process.env.MONGODB_DATABASE).collection("users");
};

exports.createHTML = (req, res) => {
  res.render('exercisePage');
};

exports.getCalendarData = async (req, res, next) => {
  const userEmail = req.session.email;
  const user = await userCollection().findOne({ email: userEmail });
  const exerciseLog = user.exerciseLog;
  res.json({ exercise: exerciseLog });
};

exports.deleteExerciseData = async (req, res) => {
  const id = req.params.id;

  try {
    await userCollection().updateOne(
      { email: req.session.email },
      { $pull: { exerciseLog: { id: id } } }
    );
    res.sendStatus(200);
  } catch (error) {
    console.error("Failed to delete exercise data", error);
    res.sendStatus(500);
  }
};

exports.updateExerciseData = async (req, res) => {
  const id = req.params.id;
  const newLog = req.body;

  try {
    await userCollection().updateOne(
      { exerciseLog: { $elemMatch: { id: id } } },
      {
        $set: {
          "exerciseLog.$.exercise": newLog.exercise,
          "exerciseLog.$.duration": newLog.duration,
          "exerciseLog.$.caloriesBurned": newLog.caloriesBurned,
        },
      }
    );

    res.sendStatus(200);
  } catch (error) {
    console.error("Failed to update exercise data", error);
    res.sendStatus(500);
  }
};
