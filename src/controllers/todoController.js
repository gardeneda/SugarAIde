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

	const response = await bot.processMessage(message);
	const todoList = exports.parseListToArray(response);

	// exports.updateToDoList(todoList, req.session.email);

	next();
}

/*
	Parses the given list into an array.
*/
exports.parseListToArray = (listString) => {
	const itemsUntrimmed = listString.split(/\d+\.\s/).filter(item => item.trim() !== "");
	const itemsTrimmed = [];
	for (let i = 0; i < itemsUntrimmed.length; i++) {
		itemsTrimmed.push(itemsUntrimmed[i].trim());
	}

	return itemsTrimmed;
}

/**
 * Takes in the array that holds the list of Strings
 * and wraps it in another array, with an extra value of 0.
 * <p>
 * The 0 signifies that this item has not been checked off.
 * <p>
 * Required because the To Do List needs to be rendered
 * on different pages other than /todo, and the user
 * should see the same items checked off on different pages.
 * <p>
 * @param {Array} arr array holding the to do list
 * @returns 2D array
 */
exports.formatArrayWithCheck = (arr) => {
	let formattedArr = [];
	for (let i = 0; i < arr.length; i++) {
		formattedArr.push([arr[i], 0]);	
	}

	return formattedArr;
}

/*
	Updates the To-Do List in the user's data.
	The List should be an array at this point.
*/
exports.updateToDoList = async (arr, account) => {
	await userCollection.updateOne(
		{ email: account },
		{ $push: { toDoList: arr } }
	)
	console.log("Successfully updated To Do List to user's database.");
}


/*
	Generates the checkbox template for each to-do list
	onto the HTML page for the /todo
*/
exports.generateCheckboxes = () => {

}

/*
	Sends the HTML page when /todo is accessed.
*/
exports.createHTML = async (req, res, next) => {
	res.render("todo");
}