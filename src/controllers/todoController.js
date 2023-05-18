/* ///////////////////////////////////////////////// */
/*  Required Packages and Constant Declaration */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const chatController = require(`${__dirname}/chatController`);

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
	.db(process.env.MONGODB_DATABASE)
	.collection("users");

const bot = require(`${__dirname}/../utils/botManager`);

/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */


/*
	Retrieves user's data
*/
exports.fetchUserData = async (req, res, next) => {
	const email = req.session.email;
	const response = await userCollection.findOne({ email: email });
	const data = response;

	return data;
}

/*
	Takes user info from the healthinfo field in user document
	and then converts it into the optimized prompt
*/
exports.userCustomizedPrompt = (userData) => {
	
	const healthinfo = userData.healthinfo;
	
	const prompt = `
	BMI: ${healthinfo?.bmi}
	Daily metabolism: ${healthinfo?.metabolism}
	Gender: ${healthinfo?.gender}
	Age: ${healthinfo?.age}
	High Cholesterol: ${healthinfo?.highchol}
	Smoker: ${healthinfo?.smoker}
	Days feeling depressed past 30 days: ${healthinfo?.menthlth}
	Days feeling unhealthy past 30 days: ${healthinfo?.physhlth}
	Eats fruits often: ${healthinfo?.fruits}
	Eats veggie often: ${healthinfo?.veggie}
	Drinks alcohol frequently: ${healthinfo?.hvyalcohol}
	Has hypertension: ${healthinfo?.hypertension}
	Has heart disease: ${healthinfo?.heartdisease}
	Had a stroke before: ${healthinfo?.stroke}
	HbA1C levels (in %): ${healthinfo?.HbA1C}
	Mean Blood Glucose Levels (mg / dl): ${healthinfo?.bloodglucose}
	`;

	return prompt;
}

/*
	Generates a To-Do list based on the user's specific health
	informaiton.
*/
exports.generateToDoList = async (req, res, next) => {
	const userData = await exports.fetchUserData(req, res, next);
	const userPrompt = exports.userCustomizedPrompt(userData);
	const aiPrompt = process.env.TO_DO;

	const message = await chatController.modifyMessage(aiPrompt, userPrompt, 1.0);
	console.log(message);

	const response = await bot.processMessage(message);
	console.log(response);

	next();
}

exports.parseListToArray = (listString) => {
	const items = listString.split(/\d+\.\s/).filter(item => item.trim() !== "");

	return items;
}

exports.updateToDoList = async (req, res, next) => {

}

/*
	Sends the HTML page when /todo is accessed.
*/
exports.createHTML = async (req, res, next) => {
	res.render("todo");
}