// TODO: Create nurtrition and exercise data today.
// TODO: Find a way to pull data from nutritionLog and exerciseLog for yesterday

/* ///////////////////////////////////////////////// */
/*  Required Packages and Constant Declaration */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
	.db(process.env.MONGODB_DATABASE)
	.collection("users");

const dateFormatter = require(`${__dirname}/../utils/dateFormatter`);
const riskAssessController = require(`${__dirname}/riskAssessController`);

/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

/**
 * Gets all of the exercise that the user at on the specific date.
 *
 * @async
 * @param {Express.Request} account user's email
 * @param {String} date the specified date
 * @returns {Array} array of exercises that the user did on a specific date
 */
exports.getExercisesByDate = async (account, date) => {
	const pipeline = [
		{
			$match: {
				email: account,
			},
		},
		{
			$unwind: "$exerciseLog",
		},
		{
			$match: {
				"exerciseLog.date_real": date,
			},
		},
		{
			$project: {
				_id: 0,
				exerciseLog: 1,
			},
		},
	];

	const result = await userCollection.aggregate(pipeline).toArray();

	if (result.length > 0) {
		const exercises = result.map((item) => item.exerciseLog);
		return exercises;
	} else {
		return [];
	}
};

/**
 * Gets all of the food that the user at on the specific date.
 *
 * @async
 * @param {Express.Request} account the user's email
 * @param {String} date the specified date
 * @returns {Array} array of food that the user ate
 */
exports.getNutrientsByDate = async (account, date) => {
	const pipeline = [
		{
			$match: {
				email: account,
			},
		},
		{
			$unwind: "$nutritionLog",
		},
		{
			$match: {
				"nutritionLog.date_real": date,
			},
		},
		{
			$project: {
				_id: 0,
				nutritionLog: 1, // Corrected field name
			},
		},
	];

	const result = await userCollection.aggregate(pipeline).toArray();

	if (result.length > 0) {
		const nutritions = result.map((item) => item.nutritionLog);
		return nutritions;
	} else {
		return [];
	}
};

/**
 * Retrieves the health information of the user.
 *
 * @param {Express.Request} account the user's email
 * @returns {Object} the user's health information
 */
exports.getHealthInfo = async (account) => {
	const user = await userCollection.findOne({ email: account });

	return user.healthinfo;
};

/**
 * Adds up all of the calories that the user ate.
 * 
 * @param {Array} nutrientList array consisting of diets
 * @returns {Number} calories consumed
 */
exports.getCaloriesConsumed = (nutrientList) => {
	let consumed = 0;

	for (const nutrients of nutrientList) {
		consumed += Number(nutrients.calories);
	}

	return consumed;
};

/**
 * Calculates the total calories burnt from performing exercises
 * and the user's daily metabolism.
 *
 * @param {Express.Request} account the user's email
 * @param {Number} metabolism
 * @returns {Number} the total calories burnt from exercise and daily metabolism
 */
exports.getCaloriesBurned = (exerciseList, metabolism) => {
	const date = dateFormatter.getToday();
	let burned = Number(metabolism);

	for (const exercises of exerciseList) {
		burned += Number(exercises.caloriesBurned);
	}

	return burned;
};

/**
 * Calculates the calories consumed, burnt and the total net calorie.
 * 
 * @param {Array} nurientList array consisting of diets
 * @param {Array} exerciseList array consisting of exercises
 * @param {Number} metabolism user's metabolism stored in their healthinfo field
 * @returns {Object} calories consumed, calories burnt and total net calorie
 */
exports.totalCalories = (nurientList, exerciseList, metabolism) => {

  const consumed = exports.getCaloriesConsumed(nurientList);
  const expenditure = exports.getCaloriesBurned(exerciseList, metabolism);

	return {
		consumed: consumed,
		burned: expenditure,
		total: consumed - expenditure,
	};
};

/**
 * Calculates the increased blood glucose level with the sugar consumed,
 * and returns it. Based on researches:
 * 
 * Research shows that each 1 gram of sugar increases the blood glucose level by 5 mg/dl
 * Research also shows that the average blood glucose level is 70 ~ 100 mg/dl
 * 
 * Maximized the blood glucose level as it makes sense that we intentionally give the
 * biggest probability to create sufficient room for prevention of diabetes
 * if the user does not know their own blood glucose level.
 *  
 * @param {Array} nutrientList arrays consisting of diets.
 * @param {Number} bloodglucose blood glucose levels in mg/dl
 * @returns {Number} calculated sugar level
 */
exports.bloodGlucoseCalculator = (nutrientList, bloodglucose) => {

	let bloodglucoseLevel = 0;

	if (bloodglucose > 0) {
		bloodglucoseLevel = bloodglucose;
	} else {
		// Maximized the blood glucose level as it makes sense that we intentionally give the
		// biggest probability to create sufficient room for prevention of diabetes
		// if the user does not know their own blood glucose level.
		bloodglucoseLevel = 100;
	}

	let sugar = 0;

	for (const nutrients of nutrientList) {
		let sugarRaw = nutrients?.sugar;
		if (sugarRaw != undefined) {
			let sugarFormatted = sugarRaw.replace(/\D/g, "");
			sugar += Number(sugarFormatted);
		}
	}
	console.log(`This is the sugar level: `, sugar);
	const sugarToBloodGlucose = sugar * 5;

	bloodglucoseLevel += sugarToBloodGlucose;

	return bloodglucoseLevel;
};

/**
 * Renews the risk assessment by inputting the new blood glucose into the
 * risk assessment formula. 
 * 
 * @param {Number} bloodglucose blood glucose in mg /dl
 * @param {Express.Request} account the user's email
 * @param {Object} healthinfo health information of the user
 * @returns {Object} risk level before and after modification
 */
exports.updateRiskAssessment = async (bloodglucose, account, healthinfo) => {
  const riskBefore = healthinfo?.risk;

	const riskAfter = riskAssessController.diabProbability(
		healthinfo?.age,
		healthinfo?.bmi,
		healthinfo?.highchol,
		healthinfo?.smoker,
		healthinfo?.stroke,
		healthinfo?.fruit,
		healthinfo?.veggie,
		healthinfo?.hvyalcohol,
		healthinfo?.menthlth,
		healthinfo?.physhlth,
		healthinfo?.hypertension,
		healthinfo?.heartdisease,
		healthinfo?.HbA1c,
		bloodglucose
	);

	// Use the dot notation for subcollections.
	userCollection.updateOne(
		{ email: account },
		{
			$set: { "healthinfo.risk": riskAfter },
		}
	);

  return { before: riskBefore, after: riskAfter };
};

/**
 * Checks if it is the user's first time logging in.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.next} next 
 */
exports.checkFirstLoginDay = async (req, res, next) => {
	const response = await userCollection.findOne({ email: req.session.email, }, { projection: { report: 1 } });
	const report = response.report;

	if (report === 1) {
		await userCollection.updateOne({ email: req.session.email }, { $set: { report: 0 } });

		next();
		
	} else {

		res.render("main");
	}
}

/**
 * Checks if it's the user's first time logging in and landing on the main page.
 * 
 * @see {@link checkFirstLoginDay} 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.next} next 
 */
exports.checkFirstLoginOnMain = async (req, res, next) => {
	const response = await userCollection.findOne({ email: req.session.email, }, { projection: { report: 1 } });
	const report = response.report;

	if (report === 1) {
		await userCollection.updateOne({ email: req.session.email }, { $set: { report: 0 } });

		await exports.createHTML(req, res, next);
		
	} else {

		next();
	}
}

/**
 * Renders the daily report page
 */
exports.createHTML = async (req, res, next) => {
	const date = dateFormatter.getYesterday();
	const exerciseList = await exports.getExercisesByDate(req.session.email, date);
	const nutrientList = await exports.getNutrientsByDate(req.session.email, date);
	const health = await exports.getHealthInfo(req.session.email);

	// console.log(exerciseList);
	// console.log(nutrientList);

  	let { consumed, burned, total } = exports.totalCalories(nutrientList, exerciseList, health?.metabolism);
  	let sugar = exports.bloodGlucoseCalculator(nutrientList, health?.bloodglucose);
  	let { before, after } = await exports.updateRiskAssessment(sugar, req.session.email, health);
  	let change = before - after;

	consumed = consumed ?? 0;
	burned = burned ?? 0;
	total = total ?? 0;
	sugar = sugar ?? 0;
	before = before ?? 0;
	after = after ?? 0;
	change = change ?? 0;
	
  	burnedFormatted = burned.toFixed(2);
  	totalFormatted = total.toFixed(2);
  	beforeFormatted = before.toFixed(4) * 100;
  	afterFormatted = after.toFixed(4) * 100;
  	changeFormatted = change.toFixed(4) * 100;

	res.render("dailyReport", {
		consumed: consumed,
		burned: burnedFormatted,
		sugar: sugar,
   		riskBefore: beforeFormatted,
    	riskAfter: afterFormatted,
    	riskChange: changeFormatted,
		total: totalFormatted,
		exerciseList: exerciseList,
		nutritionList: nutrientList,
		username: req.session.username
	});
};
