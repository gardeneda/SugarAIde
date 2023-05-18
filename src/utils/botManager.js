const { Configuration, OpenAIApi } = require("openai");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.processMessage = async (msg) => {

    const response = await openai.createCompletion(msg);
    const fullData = response.data;
  
    const answer = fullData.choices[0].text;

    return answer;
}