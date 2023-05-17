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

exports.generateToDoList = async () => {
    
}
