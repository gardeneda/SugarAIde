const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);

const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

exports.createHTML = async (req, res, next) => {
    if (!req.session.authenticated) {
        res.redirect('/login');
        return;
    } else {
        const email = req.session.email;
        const username = req.session.username;
        const user = await userCollection.findOne({email: email}); 
        res.render('/checkCalories');
    }
 }   

 exports.processForm = (req, res, next) => {
    const activity = req.body.activity;
    res.send(activity);
    res.status(200);
    res.redirect('/calorieRequirement');  
 }

