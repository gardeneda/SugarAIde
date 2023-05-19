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
const dateFormatter = require(`${__dirname}/../utils/dateFormatter`);

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

/**
 * Converts the string containing the to do list to an array.
 * 
 * @param {String} listString A String containing the list of the to do list
 * @returns array of each list as an item
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
 * @param {Date} date date that the To-Do list is for.
 * 
 * @returns 2D array
 */
exports.formatArray = (arr) => {
	let formattedArr = [];
	for (let i = 0; i < arr.length; i++) {
		formattedArr.push([arr[i], 0]);	
	}

	return formattedArr;
}

/**
 * Accepts a 2D-Array and transforms it into a JSON object
 * to insert into the database.
 * 
 * @param {Array} arr 2D Array
 * @see {@link formatArrayWithCheck} for converting todo-list array to 2D array
 */
exports.convertToObject = (arr, date) => {
	let map = new Map();
	map.set(date, arr);

	return map;
}

/**
 * Updates the To-Do List in the user's data.
 * The List should be an array at this point.
 *
 * @param {JSON} obj To-Do List in object form
 * @param {Express.Request} account the user's email in the request body.
 */
exports.updateToDoList = async (obj, account) => {
	await userCollection.updateOne(
		{ email: account },
		{ $set: { toDoList: obj } }
	)
	console.log("Successfully updated To Do List to user's database.");
}

/**
 * Fetches the user data from the database and then generatees
 * checkboxes (displays them) with the to-do list that the user is given
 * for the current date.
 * 
 * @param {Express.Request} req email account of the user
 * @returns array of to-do list stored in user's database
 */
exports.generateCheckboxes = async (account) => {
	const today = dateFormatter.getToday();
	const todoList = await userCollection.findOne(
		{ email: account },
		{ projection: { toDoList: 1 } });

	return todoList.toDoList[today];
}

/*
	Generates a To-Do list based on the user's specific health
	informaiton.
*/
exports.generateToDoList = async (req, res, next) => {
	const today = dateFormatter.getToday();
	const userData = await exports.fetchUserData(req);
	const userPrompt = exports.userCustomizedPrompt(userData);
	const aiPrompt = process.env.TO_DO;

	const message = await chatController.modifyMessage(aiPrompt, userPrompt, 1.0);

	const response = await bot.processMessage(message);
	const todoList = exports.parseListToArray(response);
	const todoArray = exports.formatArray(todoList);
	const todoObj = exports.convertToObject(todoArray, today);

	exports.updateToDoList(todoObj, req.session.email);

	next();
}

/*
	Sends the HTML page when /todo is accessed.
*/
exports.createHTML = async (req, res, next) => {
	const checkboxes = await exports.generateCheckboxes(req.session.email);
	res.render("todo", { checkboxes });
}