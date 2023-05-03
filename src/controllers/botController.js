const { Configuration, OpenAIApi } = require("openai");

const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.getAllThings = async (req, res, next) => {
  try {
    const response = await openai.createCompletion(req.body);
    const fullData = response.data;

    const answer = fullData.choices[0].text;

    console.log(typeof answer);
    console.log(answer);

    res.status(200).json({
      status: 200,
      data: answer
    });

  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 400,
      message: `There was an error in retrieving from the OpenAI API.`
    });
  }
  next();
}


