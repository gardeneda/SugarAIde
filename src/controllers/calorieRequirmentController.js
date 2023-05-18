const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

exports.createHTML = async (req, res, next) => {
    const email = req.session.email;

    const user = await userCollection.findOne({ email: email});

    const tdee = user.healthinfo?.tdee;
    const sugar = ((Number(tdee) * 0.05 ) / 4).toFixed(1);
    const carbs =  ((Number(tdee) * 0.45 ) / 4).toFixed(1);
    const fats =  ((Number(tdee) * 0.20 ) / 9).toFixed(1);
    const proteins =  ((Number(tdee) * 0.10 ) / 4).toFixed(1);

    res.render("calorieRequirement", { 
        tdee: tdee, 
        sugar: sugar, 
        carbs : carbs, 
        fats: fats, 
        proteins: proteins} 
        );

}