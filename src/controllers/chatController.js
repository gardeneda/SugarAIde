/* ///////////////////////////////////////////////// */
/*  Required Packages and Constant Declaration */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
	.db(process.env.MONGODB_DATABASE)
	.collection("users");

const bot = require(`${__dirname}/../utils/botManager`);
const crypto = require("crypto");

/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

/*
    Optimizes and fine-tunes the user message so that the AI
*/
exports.modifyMessage = function (prompt, userMessage, temperature) {
	const optimizePrompt = prompt;

	const request = {
		model: "text-davinci-003",
		temperature: temperature,
		max_tokens: 256,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	};

	const optimizedMessage = optimizePrompt + userMessage;
	const embeddedRequest = Object.assign(
		{
			prompt: optimizedMessage,
		},
		request
	);
	
	return embeddedRequest;
};

exports.stripJSON = function (message) {
	try {
        const pureJSON = { json: JSON.parse(message), leftover: undefined };
        return pureJSON;
        
    } catch (err) {
        const regex = /{[^{}]*}/
        const resJSONUnparsed = message.match(regex);
		const resJSONParsed = JSON.parse(resJSONUnparsed);
		const bareMessage = message.replace(resJSONUnparsed, "");

		return { json: resJSONParsed, leftover: bareMessage };
	}
};

/*
    Checks to see if the JSON is for nurtritional data, or exercise data.
    Depending on which, it sends a token that signifies it so 
    we can use the correct update formula to update our user's database.
*/
exports.checkJSONType = function (response) {
	if (
		response.json?.food === undefined &&
		response.json?.exercise !== undefined
	) {
		return "exercise";
	} else if (
		response.json?.exercise === undefined &&
		response.json?.food !== undefined
	) {
		return "food";
	} else {
		return "fail";
	}
};

/*
    Checks if the argument is for Exercise or Nutrition, and
    updates the user's database accordingly. 
*/
exports.updateData = async function (data, type, account, dateObject) {
	const id = crypto.randomBytes(16).toString("hex");
	switch (type) {
		case "food":
			let nutritionModel = data;
			nutritionModel.date = dateObject;
			nutritionModel.id = id;

			await userCollection.updateOne(
				{ email: account },
				{ $push: { nutritionLog: nutritionModel } }
			);
			console.log(
				`Successfully entered the food into the nutritionLog in the db!`
			);
			break;

		case "exercise":
			let exerciseModel = data;
			exerciseModel.date = dateObject;
			exerciseModel.id = id;

			await userCollection.updateOne(
				{ email: account },
				{ $push: { exerciseLog: exerciseModel } }
			);
			console.log(
				`Successfully entered the food into the exerciseLog in the db!`
			);
			break;
	}
};

/*
	Sends the user the AI's leftover message from the parsing.
*/
exports.sendMessage = function (message) {

};

/*
    Sends the OpenAI API the message prompt to retrieve its answers.
    Parses these answers into JSON, and then returns whether an object
    containing the JSON and the leftover message (if there are any), 
    and then sends

*/
exports.modifyDataUseable = async function (prompt, userMessage) {
	const optimizedMessage = exports.modifyMessage(prompt, userMessage, 0.7);
	const response = await bot.processMessage(optimizedMessage);
	const formattedResponse = exports.stripJSON(response);
	const dataType = exports.checkJSONType(formattedResponse);

	return [formattedResponse, dataType];
};

/*
    Sends the chat interface to the client for the user
    to chat with the bot. Each request posted from this is
    a post request to /chat
*/
exports.createHTML = (req, res, next) => {
	res.render("chat");
};

/*
    Takes user input and runs it through the OpenAI API
    to send a response back. If the user input signifies something
    about their diet or exercise, update this to the user's database.
*/
exports.processUserMessage = async (req, res, next) => {
	const dateObject = new Date().toString();
	const userMessage = req.body.userMessage;
    const [data, dataType] = await exports.modifyDataUseable(process.env.ASK_AI, userMessage);
	exports.updateData(data.json, dataType, req.session.email, dateObject);
	res.json(data);

};
