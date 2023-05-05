const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

/*
    Calculate the BMI with the respective formula.
*/
const bmiCalculator = function (height, weight) {
    const heightInMeters = height / 100;

    return weight / Math.pow(heightInMeters, 2);
};

exports.createHTML = (req, res, next) => {
    res.render('health-consent', { username: req.session.username });
};

exports.createForm = (req, res, next) => {
    res.render('health-information');
};

exports.updateUserInfo = (req, res, next) => {
    const currentUser = req.session.email;
};