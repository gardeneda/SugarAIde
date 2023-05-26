const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require('express');
const Joi = require("joi");
const app = express();
app.set('view engine', 'ejs');

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

// Import necessary controllers and utility functions
const dateFormatter = require(`${__dirname}/../utils/dateFormatter`);
const dailyReportController = require(`${__dirname}/dailyReportController`);
const checkCaloriesController = require(`${__dirname}/checkCaloriesController`);

// Function to calculate and return daily nutrition values for a given email
exports.getDailyValues = async (email) => {
    const user = await userCollection.findOne({ email: email });
    const date = dateFormatter.getToday();
    const nutritions = await dailyReportController.getNutrientsByDate(email, date);

    if (!nutritions) {
        return null;

    } else {
        
        let totalSugar = 0;
        for (const nutrition of nutritions) {
            let sugarRaw = nutrition?.sugar;
            if (sugarRaw != undefined && typeof sugarRaw == 'string') {
                let sugarFormatted = sugarRaw.replace(/\D/g, "");
                totalSugar += Number(sugarFormatted);

            } else if (typeof sugarRaw == 'number') {
                totalSugar += sugarRaw;
            }
        }

        let totalCalories = 0;
        for (const nutrition of nutritions) {
            let calorieRaw = nutrition?.calories;
            if (calorieRaw != undefined && typeof calorieRaw == 'string') {
                let calorieFormatted = calorieRaw.replace(/\D/g, "");
                totalCalories += Number(calorieFormatted);

            } else if (typeof calorieRaw == 'number') {
                totalCalories += calorieRaw;
            }
        }

        let totalFat = 0;
        for (const nutrition of nutritions) {
            let fatRaw = nutrition?.fat;
            if (fatRaw != undefined && typeof fatRaw == 'string') {
                let fatFormatted = fatRaw.replace(/\D/g, "");
                totalFat += Number(fatFormatted);

            } else if (typeof fatRaw == 'number') {
                totalFat += fatRaw;
            }
        }
            
        let totalCarbs = 0;
        for (const nutrition of nutritions) {
            let carbRaw = nutrition?.carbohydrates;
            if (carbRaw != undefined && typeof carbRaw == 'string') {
                let carbFormatted = carbRaw.replace(/\D/g, "");
                totalCarbs += Number(carbFormatted);

            } else if (typeof carbRaw == 'number') {
                totalCarbs += carbRaw;
            }
        }

        let totalProtein = 0;
        for (const nutrition of nutritions) {
            let proteinRaw = nutrition?.protein;
            if (proteinRaw != undefined && typeof proteinRaw == 'string') {
                let proteinFormatted = proteinRaw.replace(/\D/g, "");
                totalProtein += Number(proteinFormatted);

            } else if (typeof proteinRaw == 'number') {
                totalProtein += proteinRaw;
            }
        }

        let tdee = user.healthinfo?.tdee;

        if (user.healthinfo?.tdee == undefined ||user.healthinfo?.tdee == null) {
            await userCollection.updateOne({ email: email }, { $set: { 'healthinfo.tdee': (user.healthinfo?.metabolism * 1.2) } });
            tdee = user.healthinfo?.metabolism * 1.2;
        }

        const sugarLimit = ((Number(tdee) * 0.05) / 4).toFixed(1);
        const carbsLimit = ((Number(tdee) * 0.50) / 4).toFixed(1);
        const fatsLimit = ((Number(tdee) * 0.30) / 9).toFixed(1);
        const proteinsLimit = ((Number(tdee) * 0.20) / 4).toFixed(1);

        const dailyValuesObject = {
            tdee: Math.trunc(tdee),
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
            tdee: Math.trunc(tdee),
            sugarLimit: sugarLimit,
            carbsLimit: carbsLimit,
            fatsLimit: fatsLimit,
            proteinsLimit: proteinsLimit,
            totalCalories: totalCalories,
            totalFat: totalFat,
            totalCarbs: totalCarbs,
            totalSugar: totalSugar,
            totalProtein: totalProtein,
            aggregateResult: nutritions,
            remainingCal: tdee - totalCalories
        };
    }
}

// Middleware function to calculate and update daily nutrition values on main rout
exports.getDailyValuesOnMain = async (req, res, next) => {
    const user = await userCollection.findOne({ email: req.session.email });
    const date = dateFormatter.getToday();
    const nutritions = await dailyReportController.getNutrientsByDate(req.session.email, date);

    if (!nutritions) {
        return null;

    } else {
        
        // Retrieve nutrtions (sugar, carbs, protein, fats) from the current item

        let totalSugar = 0;
        for (const nutrition of nutritions) {
            let sugarRaw = nutrition?.sugar;
            if (sugarRaw != undefined && typeof sugarRaw == 'string') {
                let sugarFormatted = sugarRaw.replace(/\D/g, "");
                totalSugar += Number(sugarFormatted);

            } else if (typeof sugarRaw == 'number') {
                totalSugar += sugarRaw;
            }
        }

        let totalCalories = 0;
        for (const nutrition of nutritions) {
            let calorieRaw = nutrition?.calories;
            if (calorieRaw != undefined && typeof calorieRaw == 'string') {
                let calorieFormatted = calorieRaw.replace(/\D/g, "");
                totalCalories += Number(calorieFormatted);

            } else if (typeof calorieRaw == 'number') {
                totalCalories += calorieRaw;
            }
        }

        let totalFat = 0;
        for (const nutrition of nutritions) {
            let fatRaw = nutrition?.fat;
            if (fatRaw != undefined && typeof fatRaw == 'string') {
                let fatFormatted = fatRaw.replace(/\D/g, "");
                totalFat += Number(fatFormatted);

            } else if (typeof fatRaw == 'number') {
                totalFat += fatRaw;
            }
        }
            
        let totalCarbs = 0;
        for (const nutrition of nutritions) {
            let carbRaw = nutrition?.carbohydrates;
            if (carbRaw != undefined && typeof carbRaw == 'string') {
                let carbFormatted = carbRaw.replace(/\D/g, "");
                totalCarbs += Number(carbFormatted);

            } else if (typeof carbRaw == 'number') {
                totalCarbs += carbRaw;
            }
        }

        let totalProtein = 0;
        for (const nutrition of nutritions) {
            let proteinRaw = nutrition?.protein;
            if (proteinRaw != undefined && typeof proteinRaw == 'string') {
                let proteinFormatted = proteinRaw.replace(/\D/g, "");
                totalProtein += Number(proteinFormatted);

            } else if (typeof proteinRaw == 'number') {
                totalProtein += proteinRaw;
            }
        }

        //tdee(total daily energy expenditure) to calculate personalized nutrional requirement 
        let tdee = user.healthinfo?.tdee;

        if (user.healthinfo?.tdee == undefined ||user.healthinfo?.tdee == null) {
            await userCollection.updateOne({ email: req.session.email }, { $set: { 'healthinfo.tdee': (user.healthinfo?.metabolism * 1.2) } });
            tdee = user.healthinfo?.metabolism * 1.2;
        }

        const sugarLimit = ((Number(tdee) * 0.05) / 4).toFixed(1);
        const carbsLimit = ((Number(tdee) * 0.50) / 4).toFixed(1);
        const fatsLimit = ((Number(tdee) * 0.30) / 9).toFixed(1);
        const proteinsLimit = ((Number(tdee) * 0.20) / 4).toFixed(1);

        const dailyValuesObject = {
            tdee: Math.trunc(tdee),
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
            { email: req.session.email },
            { $set: { dailyValues: dailyValuesObject } }
        );
    }
    next();
}

exports.createHTML = async (req, res, next) => {
    const email = req.session.email;
    const dailyValues = await exports.getDailyValues(email);
    
    if (!dailyValues) {
        res.render("calorieRequirement", {
            message: "No nutrition information available for today.",
            aggregateResult: null
        });
    } else {
        res.render("calorieRequirement", dailyValues); 
    }
}

// Function to calculate and return daily nutrition values
exports.calculateDailyValues = async (req, res, next) => {
    const email = req.session.email;
    const dailyValues = await getDailyValues(email);
    return dailyValues;
}
