const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const bcrypt = require("bcrypt");
const saltRounds = 12;
const express = require("express");
const app = express();
app.set("view engine", "ejs");

// To access ObjectID in MongoDB
const { ObjectId } = require('mongodb');

// For JSON Web Tokens to reset password
const jwt = require("jsonwebtoken");

/* End Secret Information Section */
const JWT_SECRET = process.env.JWT_SECRET;

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");

exports.resetPassword = async (req, res, next) => {
  // Get user id and token from url
  const { id, token } = req.params;

  // Find user in database
  const user = await userCollection.findOne({ _id: new ObjectId(id) });

  // If user does not exist, return error message
  if (!user) {
    // res.render('resetPassword', { msg: "ID not found!" });
    res.send("ID not found!");
    return;
  }

  // Create secret for JWT
  const secret = JWT_SECRET + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.render("resetPassword", { email: user.email });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  // Get user id and token from url
  const { id, token } = req.params;

  // Get new password from form
  const { newPassword } = req.body;

  // Find user in database
  const user = await userCollection.findOne({ _id: new ObjectId(id) });

  // If user does not exist, return error message
  if (!user) {
    // res.render('resetPassword', { msg: "ID not found!" });
    res.send("ID not found!");
    return;
  }

  // Create secret for JWT
  const secret = JWT_SECRET + user.password;
  try {
    // Verify the token
    const payload = jwt.verify(token, secret);

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: user.password } }
    );

    // Password successfully updated
    res.render("passwordUpdated");
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
