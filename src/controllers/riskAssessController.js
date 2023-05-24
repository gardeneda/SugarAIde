const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");
    
/*
  This is the formula attained from the MLR (OLS Regression) test for
  the coefficients of all of the variables linked to diabetes from
  the 'Diabetes Health Indicator' data set.

  NOTE: Log Odds is a statistical formula that finds the 'odds' of the
  dependent variable from happening.
*/
const diabProbabilityLifestyle = function (
    age,
    bmi,
    highchol = 0,
    smoker,
    stroke,
    fruit = 0,
    veggie = 0,
    hvyalcohol = 0,
    menthlth = 0,
    physhlth = 0
) {

    const logOdds =
        -0.397 +
        (0.0044 * age) +
        (0.0133 * bmi) +
        (0.118 * highchol) +
        (0.0167 * smoker) +
        (0.1146 * stroke) +
        (-0.016 * fruit) +
        (-0.0292 * veggie) +
        (-0.0873 * hvyalcohol) +
        (0.0009 * menthlth) +
        (0.005 * physhlth);

    const probability = 1 / (1 + Math.exp(-logOdds));

    return probability;
}

/*
  This is the formula attained from the MLR (OLS Regression) test for
  the coefficients of all of the variables linked to diabetes from
  the 'Diabetes Prediction' data set.

  NOTE: This is used for health conditions, such as hypertension,
  heart disease and blood glucose levels.

  NOTE: Log Odds is a statistical formula that finds the 'odds' of the
  dependent variable from happening.
*/
const diabProbabilityMedical = function (
    age,
    hypertension = 0,
    heartdisease = 0,
    bmi,
    HbA1c = 0,
    bloodglucose = 0
) {
    const logOdds =
        -0.8659 +
        (0.0014 * age) +
        (0.0964 * hypertension) +
        (0.12 * heartdisease) +
        (0.0043 * bmi) +
        (0.0814 * HbA1c) +
        (0.0023 * bloodglucose);

    probability = 1 / (1 + Math.exp(-logOdds));

    return probability;
}

/*
    Returns the highest probability out of the two functions of
    diabProbabilityMedical and diabProbabilityLifestyle.
*/
exports.diabProbability = function (
    age,
    bmi,
    highchol = 0,
    smoker,
    stroke,
    fruit = 0,
    veggie = 0,
    hvyalcohol = 0,
    menthlth = 0,
    physhlth = 0,
    hypertension = 0,
    heartdisease = 0,
    HbA1c = 0,
    bloodglucose = 0
) {
    a = diabProbabilityLifestyle(
        age,
        bmi,
        highchol,
        smoker,
        stroke,
        fruit,
        veggie,
        hvyalcohol,
        menthlth,
        physhlth
    );

    b = diabProbabilityMedical(
        age,
        hypertension,
        heartdisease,
        bmi,
        HbA1c,
        bloodglucose
    );

    return (a > b) ? a : b;
}

/*
    Calculates the risk of the user getting diabetes with the health information
    they provided, and renders the page with the according data.
*/
exports.createHTML = async (req, res, next) => {
    if (!req.session.authenticated) {
        res.send("Must log-in");
        return;
    }

    const email = req.session.email;

    const user = await userCollection.findOne({ email: email });

    const risk = this.diabProbability(
        user.healthinfo?.age, user.healthinfo?.bmi, user.healthinfo?.highchol,
        user.healthinfo?.smoker, user.healthinfo?.stroke, user.healthinfo?.fruit,
        user.healthinfo?.veggie, user.healthinfo?.hvyalcohol, user.healthinfo?.menthlth,
        user.healthinfo?.physhlth, user.healthinfo?.hypertension, user.healthinfo?.heartdisease,
        user.healthinfo?.HbA1c, user.healthinfo?.bloodglucose
    );

    // Use the dot notation for subcollections.
    userCollection.updateOne({ email: email }, {
        $set: { "healthinfo.risk": risk }
    });

    const formattedRisk = (risk.toFixed(5) * 100);

    res.render("risk-assessment", { risk: formattedRisk });
}