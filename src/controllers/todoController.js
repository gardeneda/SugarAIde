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
 * Checks if a To-Do list has been created for the user today.
 * 
 * @param {Email} account the email that the user signed up with.
 * @param {Date} specificDate the date that we are searching for
 * @returns null if no entry
 */
exports.isFirstTimeLogInToday = async (account, specificDate) => {
	// const result = await userCollection.findOne(
	// 	{ [`toDoList.${specificDate}`]: { $exists: true } },
	// 	{ projection: { [`toDoList.${specificDate}`]: 1 } }
	// );

	const user = await userCollection.findOne(
	  { email: account, [`toDoList.${specificDate}`]: { $exists: true } }
	);

	if (user && user.toDoList[specificDate]) {
		const value = user.toDoList[specificDate];
		return value;

	} else {
		return null;
	}
}


/**
 * Updates the To-Do List in the user's data.
 * The List should be an array at this point.
 *
 * @param {Array} array To-Do List in 2D-Array
 * @param {Express.Request} account the user's email in the request body.
 * @param {Date} date the date that the to do list is generated.
 * @see {@link formatArray} for converting to-do list to 2D array
 */
exports.updateToDoList = async (array, account, date) => {
	await userCollection.updateOne(
		{ email: account },
		{ $set: { [`toDoList.${date}`]: array } }
	)
	console.log("Successfully updated To Do List to user's database.");
}

/**
 * Fetches the user data from the database and then generatees
 * checkboxes (displays them) with the to-do list that the user is given
 * for the current date.
 * 
 * @param {Express.Request} req email account of the user
 * @param {Date} date the date the to-do list should be retrieved from
 * @returns array of to-do list stored in user's database
 */
exports.fetchCheckboxes = async (account, date) => {
	const todoList = await userCollection.findOne(
		{ email: account , toDoList: { $exists: true }},
		{ projection: { toDoList: 1 } });
	
	console.log(`This is inside the fetchCheckboxes(): `, todoList);
	
	if (todoList == null) {
		console.log(`Null condition was called.`);
		return null;
	} else {
		console.log(`Non-null condition was called.`);
		return todoList.toDoList[date];
	}
}

/*
	Generates a To-Do list based on the user's specific health
	informaiton.
*/
exports.generateToDoList = async (req, res, next) => {
	
	const today = dateFormatter.getToday();
	const status = await exports.isFirstTimeLogInToday(req.session.email, today)

	if (status == null) {
		const userData = await exports.fetchUserData(req);
		const userPrompt = exports.userCustomizedPrompt(userData);
		const aiPrompt = process.env.TO_DO;
		const message = await chatController.modifyMessage(aiPrompt, userPrompt, 1.0);
		const response = await bot.processMessage(message);
	
		const todoList = exports.parseListToArray(response);
		const todoArray = exports.formatArray(todoList);
	
		// Deprecated.
		// const todoObj = exports.convertToObject(todoArray, today);
	
		exports.updateToDoList(todoArray, req.session.email, today);

		console.log("Inner scope is accessed.");
	}

	next();
}

/**
 * Handles the post request from the client when the user clicks on a
 * checkbox (of the To-Do List) to confirm they finished the task.
 * Updates the entry on the user's database with the items of the to-do
 * that the user has clicked.
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {Express.next} next 
 */
exports.processCheckedItems = async (req, res, next) => {
	const today = dateFormatter.getToday();
	const toDoList = await exports.fetchCheckboxes(req.session.email, today);
	const checkedValues = req.body.checkedValues;

	// Instead of using a nested for loop, doing this.
	// This is to minimize this function to O(n), instead of
	// O(n^2).

	for (let i = 0; i < toDoList.length; i++) {
		toDoList[i][1] = 0;
	}

	for (let j = 0; j < checkedValues.length; j++) {
		const value = toDoList[Number(checkedValues[j])];
		value[1] = 1;

		// map.set(Number(checkedValues[j]), value);
	}

	userCollection.updateOne(
		{ email: req.session.email },
		{
			$set: { [`toDoList.${today}`]: toDoList }
		});
		
	console.log(`Successfuly updated user's progress.`);
}

/*
	Sends the HTML page when /todo is accessed.
*/
exports.createHTML = async (req, res, next) => {
	const today = dateFormatter.getToday();
	const checkboxes = await exports.fetchCheckboxes(req.session.email, today);
	res.render("todo", { checkboxes });
}