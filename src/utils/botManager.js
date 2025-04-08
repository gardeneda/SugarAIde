const { Configuration, OpenAIApi } = require("openai");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.processMessage = async (msg) => {
	const response = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [
			{ role: "system", content: "You are a helpful assistant." },
			{ role: "user", content: String(msg) }
		],
		temperature: 1,
		max_tokens: 150
	});
	const answer = response.data.choices[0].message.content;
	return answer;
};
