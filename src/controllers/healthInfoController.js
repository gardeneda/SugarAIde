const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

/*
    Calculate the BMI with the respective formula.
*/
exports.bmiCalculator = function (height, weight) {
    const heightInMeters = height / 100;

    return weight / Math.pow(heightInMeters, 2);
}

/*
    Calculate the daily metabolism rate of the individual.
*/
exports.metabolismCalcuator = function (gender, height, weight, age) {
    if (gender === "F") {
        return 447.593 + (9.247 * weight) + (3.089 * height) - (4.330 * age);

    } else {
        return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    }

};

exports.createHTML = (req, res, next) => {
    res.render('health-consent', { username: req.session.username });
}

exports.createForm = (req, res, next) => {
    res.render('health-information');
}

exports.processForm = (req, res, next) => {
    const height = Number(req.body.height);
    const weight = Number(req.body.weight);
    const gender = req.body.gender;
    const age = Number(req.body.age);
    const highchol = Number(req.body.highchol);
    const smoker = Number(req.body.smoker);
    const menthlth = Number(req.body.menthlth);
    const physhlth = Number(req.body.physhlth);
    const fruits = Number(req.body.fruits);
    const veggie = Number(req.body.veggie);
    const hvyalcohol = Number(req.body.hvyalcohol);
    const hypertension = Number(req.body.hypertension);
    const heartdisease = Number(req.body.heartdisease);
    const HbA1C = Number(req.body.HbA1C);
    const bloodglucose = Number(req.body.bloodglucose);
    const diabetes = Number(req.body.diabetes);
    const stroke = Number(req.body.stroke);

    // console.log(`This is the value: ${height} and the type: ${typeof height}`);

    const bmi = this.bmiCalculator(height, weight);
    const metabolism = this.metabolismCalcuator(gender, height, weight, age);

    userCollection
        .updateOne({ email: req.session.email }, {
            $set: {
                healthinfo: {
                    height: height,
                    weight: weight,
                    gender: gender,
                    age: age,
                    highchol: highchol,
                    smoker: smoker,
                    menthlth: menthlth,
                    physhlth: physhlth,
                    fruits: fruits,
                    veggie: veggie,
                    hvyalcohol: hvyalcohol,
                    hypertension: hypertension,
                    heartdisease: heartdisease,
                    stroke: stroke,
                    HbA1C: HbA1C,
                    bloodglucose: bloodglucose,
                    diabetes: diabetes,
                    bmi: bmi,
                    metabolism: metabolism
                }
            }
        });
    res.status(200);
    res.redirect('/risk');
}