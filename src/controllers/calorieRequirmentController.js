const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

const dateFormatter = require(`${__dirname}/../utils/dateFormatter`);
const dailyReportController = require(`${__dirname}/dailyReportController`);

async function getDailyValues(email) {
    const user = await userCollection.findOne({ email: email });
    const date = dateFormatter.getToday();
    const nutritions = await dailyReportController.getNutrientsByDate(email, date);

    console.log(nutritions);

    if (!nutritions) {
        return null;

    } else {
        
        let totalSugar = 0;
        for (const nutrition of nutritions) {
            let sugarRaw = nutrition?.sugar;
            if (sugarRaw != undefined) {
                let sugarFormatted = sugarRaw.replace(/\D/g, "");
                totalSugar += Number(sugarFormatted);
            }
        }

        let totalCalories = 0;
        for (const nutrition of nutritions) {
            let calorieRaw = nutrition?.calories;
            if (calorieRaw != undefined) {
                let calorieFormatted = calorieRaw.replace(/\D/g, "");
                totalCalories += Number(calorieFormatted);
            }
        }

        let totalFat = 0;
        for (const nutrition of nutritions) {
            let fatRaw = nutrition?.fat;
            if (fatRaw != undefined) {
                let fatFormatted = fatRaw.replace(/\D/g, "");
                totalFat += Number(fatFormatted);
            }
        }
            
        let totalCarbs = 0;
        for (const nutrition of nutritions) {
            let carbRaw = nutrition?.carbohydrates;
            if (carbRaw != undefined) {
                let carbFormatted = carbRaw.replace(/\D/g, "");
                totalCarbs += Number(carbFormatted);
            }
        }

        let totalProtein = 0;
        for (const nutrition of nutritions) {
            let proteinRaw = nutrition?.protein;
            if (proteinRaw != undefined) {
                let proteinFormatted = proteinRaw.replace(/\D/g, "");
                totalProtein += Number(proteinFormatted);
            }
        }

        const tdee = user.healthinfo?.tdee;
        const sugarLimit = ((Number(tdee) * 0.05) / 4).toFixed(1);
        const carbsLimit = ((Number(tdee) * 0.50) / 4).toFixed(1);
        const fatsLimit = ((Number(tdee) * 0.30) / 9).toFixed(1);
        const proteinsLimit = ((Number(tdee) * 0.20) / 4).toFixed(1);

        const dailyValuesObject = {
            totalCalories: totalCalories,
            totalFat: totalFat,
            totalCarbs: totalCarbs,
            totalSugar: totalSugar,
            totalProtein: totalProtein,
            sugarLimit: sugarLimit,
            carbsLimit: carbsLimit,
            fatsLimit: fatsLimit,
            proteinsLimit: proteinsLimit,
            date: date
        };
    
        // Update the user document with the new dailyValues
        await userCollection.updateOne(
            { email: email },
            { $set: { dailyValues: dailyValuesObject } }
        );

        return {
            tdee: tdee.toFixed(0),
            sugarLimit: sugarLimit,
            carbsLimit: carbsLimit,
            fatsLimit: fatsLimit,
            proteinsLimit: proteinsLimit,
            totalCalories: totalCalories,
            totalFat: totalFat,
            totalCarbs: totalCarbs,
            totalSugar: totalSugar,
            totalProtein: totalProtein,
            aggregateResult: nutritions
        };
    }
}

exports.createHTML = async (req, res, next) => {
    const email = req.session.email;
    const dailyValues = await getDailyValues(email);
    
    if (!dailyValues) {
        res.render("calorieRequirement", {
            message: "No nutrition information available for today.",
            aggregateResult: null
        });
    } else {
        res.render("calorieRequirement", dailyValues); 
    }
}

exports.calculateDailyValues = async (req, res, next) => {
    const email = req.session.email;
    const dailyValues = await getDailyValues(email);
    return dailyValues;
}

module.exports = {
    createHTML: exports.createHTML,
    calculateDailyValues: exports.calculateDailyValues,
}