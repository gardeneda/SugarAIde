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

/* End of Required Packages and Constant Declaration */
/* ///////////////////////////////////////////////// */

exports.getExercisesByDate = async (account, date) => {
    const pipeline = [
      { $match: { email: account } },
      {
        $project: {
          exerciseLog: {
            $filter: {
              input: "$exerciseLog",
              as: "exercise",
              cond: { $eq: ["$$exercise.date_real", date] }
            }
          }
        }
      }
    ];

    const result = await userCollection.aggregate(pipeline).toArray();
    return result.length > 0 ? result[0].exerciseLog : [];
};

exports.test = async (req, res, next) => {
  exports.getExercisesByDate(req.session.email, dateFormatter.getYesterday());
}