// Snippet of code here referenced from sample of
// Assignment 1 in Patrick Guichon's COMP 2537

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;

const MongoClient = require('mongodb').MongoClient;

const atlasURL = `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/?retryWrites=true&w=majority`

var database = new MongoClient(atlasURL, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = database;