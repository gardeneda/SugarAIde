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

const imageNumber = 4;
/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

/*
    Send the user client the main landing page after you log-in.
    Attaches a random picture when signed in.
*/
exports.createHTML = (req, res) => {
  res.render('main')
};

/* 
    Checks if the user has a valid session/cookie.
    If not redirects them to the login page.
*/
exports.checkCookie = (req, res, next) => {
  if (!req.session.authenticated) {
    res.redirect("/");
    return;
  }
  next();
};

