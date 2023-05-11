/* ///////////////////////////////////////////////// */
/*  Required Packages and Constant Declaration */
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
  .db(process.env.MONGODB_DATABASE)
  .collection("users");

const bot = require(`${__dirname}/../utils/botManager`);

const optimizePrompt = process.env.ASK_AI;

const request = {
  model: "text-davinci-003",
  temperature: 0.0,
  max_tokens: 256,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

// const userChatObject = {
//   role: "user",
// };

// const chatRequest = {
//     "model": "gpt-3.5-turbo"
// }


/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

/*
    Sends the OpenAI API the message prompt that the
    user has said, and attach the optimized prompt at the beginning
    to ensure that the AI answers in the format we need.
*/
async function sendUserMessage(userMessage) {
    const optimizedMessage = optimizePrompt + userMessage;
    const embeddedRequest = Object.assign(
      {
        prompt: optimizedMessage,
      },
      request
    );
  
    console.log(embeddedRequest);
    
    const response = await bot.processMessage(embeddedRequest);
    const strippedResponse = stripJSON(response);
    const dataType = checkJSONType(strippedResponse);

} 


exports.stripJSON = (message) => {
    const originalMessage = message;
    const regex = '/{.*}/';
    try {
        const resJSONUnparsed = originalMessage.match(regex)[0];
        const resJSONParsed = JSON.parse(resJSONUnparsed);
        const bareMessage = originalMessage.replace(regex, '');

        return { json: resJSONParsed, leftover: bareMessage };

    } catch (err) {

        console.log(originalMessage);

        return originalMessage;
    }
}

/*
    Checks to see if the JSON is for nurtritional data, or exercise data.
    Depending on which, it sends a token that signifies it so 
    we can use the correct update formula to update our user's database.
*/
exports.checkJSONType = (response) => {
    if (response.food === undefined && response.exercise !== undefined) {

        return "exercise";

    } else if (response.exercise === undefined && response.food !== undefined) {

        return "food";

    } else {

        return "fail";
    }
}

/*
    Sends the chat interface to the client for the user
    to chat with the bot. Each request posted from this is
    a post request to /chat
*/
exports.createHTML = (req, res, next) => {
  res.render("chat");
};

/*
    Checks if the argument is for Exercise or Nutrition, and
    updates the user's database accordingly.
*/
exports.updateData = async (req, res, next) => {

    // Check if there is a field called "exercise" or "food"
    // and then direct the update to be done for that field.




};

/*
    Takes user input and runs it through the OpenAI API
    to send a response back. If the user input signifies something
    about their diet or exercise, update this to the user's database.
*/
exports.processUserMessage = async (req, res, next) => {
    const userMessage = req.body.userMessage;

};



