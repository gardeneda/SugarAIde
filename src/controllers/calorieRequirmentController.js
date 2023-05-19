const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

const moment = require('moment');

exports.createHTML = async (req, res, next) => {
    const email = req.session.email;

    const user = await userCollection.findOne({ email: email});

    console.log(user.nutritionLog);
    console.log(JSON.stringify(user.nutritionLog, null, 2));

    const today = moment().utc().subtract(9, 'hours').startOf('day');
    const tomorrow = moment(today).utc().add(1, 'days');
    
    const aggregateResult = await userCollection.aggregate([
        { $match: { email: email } },
        { $unwind: "$nutritionLog" },
        { $addFields: { 
            "nutritionLog.date": { $toDate: "$nutritionLog.date" },
            "nutritionLog.fat": {
                $cond: [
                    { $and: [ { $ne: [ "$nutritionLog.fat", undefined ] }, { $eq: [{$type: "$nutritionLog.fat"}, "string"] } ] },
                    { $toDouble: { $substr: [ "$nutritionLog.fat", 0, { $subtract: [ { $strLenCP: "$nutritionLog.fat" }, 1 ] } ] } },
                    "$nutritionLog.fat"
                ]
            },
            "nutritionLog.carbohydrates": {
                $cond: [
                    { $and: [ { $ne: [ "$nutritionLog.carbohydrates", undefined ] }, { $eq: [{$type: "$nutritionLog.carbohydrates"}, "string"] } ] },
                    { $toDouble: { $substr: [ "$nutritionLog.carbohydrates", 0, { $subtract: [ { $strLenCP: "$nutritionLog.carbohydrates" }, 1 ] } ] } },
                    "$nutritionLog.carbohydrates"
                ]
            },
            "nutritionLog.sugar": {
                $cond: [
                    { $and: [ { $ne: [ "$nutritionLog.sugar", undefined ] }, { $eq: [{$type: "$nutritionLog.sugar"}, "string"] } ] },
                    { $toDouble: { $substr: [ "$nutritionLog.sugar", 0, { $subtract: [ { $strLenCP: "$nutritionLog.sugar" }, 1 ] } ] } },
                    "$nutritionLog.sugar"
                ]
            },
            "nutritionLog.protein": {
                $cond: [
                    { $and: [ { $ne: [ "$nutritionLog.protein", undefined ] }, { $eq: [{$type: "$nutritionLog.protein"}, "string"] } ] },
                    { $toDouble: { $substr: [ "$nutritionLog.protein", 0, { $subtract: [ { $strLenCP: "$nutritionLog.protein" }, 1 ] } ] } },
                    "$nutritionLog.protein"
                ]
            },
        }},
        { $match: { "nutritionLog.date": { $gte: today.toDate(), $lt: tomorrow.toDate() } } },
        { $group: {
            _id: null,
            totalCalories: { $sum: { $toDouble: "$nutritionLog.calories" } },
            totalFat: { $sum: "$nutritionLog.fat" },
            totalCarbs: { $sum: "$nutritionLog.carbohydrates" },
            totalSugar: { $sum: "$nutritionLog.sugar" },
            totalProtein: { $sum: "$nutritionLog.protein" }
        }}
    ]).toArray();
    
    if (!aggregateResult[0]) {
        // If nutritionInfo is not available, render a message indicating the lack of information
        res.render("calorieRequirement", {
            message: "No nutrition information available for today.",
            aggregateResult: null
        });
      } else {
        const dailyValues = aggregateResult[0];
        const totalCalories = dailyValues.totalCalories || 0;
        const totalFat = dailyValues.totalFat || 0;
        const totalCarbs = dailyValues.totalCarbs || 0;
        const totalSugar = dailyValues.totalSugar || 0;
        const totalProtein = dailyValues.totalProtein || 0;
      
        console.log("totalCalories: " + totalCalories);
        console.log("totalFat: " + totalFat);
        console.log("totalCarbs: " + totalCarbs);
        console.log("totalSugar: " + totalSugar);
        console.log("totalProtein: " + totalProtein);
        console.log("aggregateResult:" + JSON.stringify(aggregateResult, null, 2));
      
        const tdee = user.healthinfo?.tdee;
        const sugarLimit = ((Number(tdee) * 0.05 ) / 4).toFixed(1);
        const carbsLimit =  ((Number(tdee) * 0.50 ) / 4).toFixed(1);
        const fatsLimit =  ((Number(tdee) * 0.30 ) / 9).toFixed(1);
        const proteinsLimit =  ((Number(tdee) * 0.20 ) / 4).toFixed(1);
      
        res.render("calorieRequirement", { 
            tdee: tdee.toFixed(0), 
            sugarLimit: sugarLimit, 
            carbsLimit : carbsLimit, 
            fatsLimit: fatsLimit, 
            proteinsLimit: proteinsLimit,
            totalCalories: dailyValues.totalCalories || 0,
            totalFat: dailyValues.totalFat || 0,
            totalCarbs: dailyValues.totalCarbs || 0,
            totalSugar: dailyValues.totalSugar || 0,
            totalProtein: dailyValues.totalProtein || 0,
            aggregateResult: aggregateResult || null
        });
        
      }
      
}