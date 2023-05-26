// All things to do with servers are put here.

const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./src/middleware/app');

const database = require(`${__dirname}/src/config/databaseConfig`);
const userCollection = database
	.db(process.env.MONGODB_DATABASE)
    .collection("users");
    
const schedule = require('node-schedule');
const todoController = require('./src/controllers/todoController');
const dailyReportController = require('./src/controllers/dailyReportController');

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})

const job = schedule.scheduleJob('0 17 * * * *', async () => {
    // Code to be executed at 12:00 AM every day
    console.log("The script has successfully run at its designated time.");
    
    await dailyReportController.resetReport();

    const allUsers = await userCollection.find({}).toArray();
    allUsers.forEach(async (user) => {
        await todoController.generateToDoListScript(user.email, user);
    })
    
    console.log("Script has finished running.");
});
