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
}

exports.createHTML = (req, res, next) => {
    res.render('health-consent', { username: req.session.username });
}

exports.createForm = (req, res, next) => {
    res.render('health-information');
}

exports.processForm = (req, res, next) => {
    console.log(req.body);
    const height = Number(req.body.height);
    const weight = Number(req.body.weight);
    const gender = req.body.gender;
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
    const diabetes = Number(req.body.diabetes); diabetes

    console.log(`This is the value: ${height} and the type: ${typeof height}`);

    userCollection
        .updateOne({ email: req.session.email }, {
            $set: {
                healthinfo: {
                    height: height,
                    weight: weight,
                    gender: gender,
                    highchol: highchol,
                    smoker: smoker,
                    menthlth: menthlth,
                    physhlth: physhlth,
                    fruits: fruits,
                    veggie: veggie,
                    hvyalcohol: hvyalcohol,
                    hypertension: hypertension,
                    heartdisease: heartdisease,
                    HbA1C: HbA1C,
                    bloodglucose: bloodglucose,
                    diabetes: diabetes
                }
            }
        });
    res.status(200);
    res.redirect('/risk');
}