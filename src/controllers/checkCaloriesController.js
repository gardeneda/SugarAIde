const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const database = require(`${__dirname}/../config/databaseConfig`);

const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

exports.createHTML = (req, res, next) => {
        const email = req.session.email;
        const username = req.session.username;
        res.render('checkCalories', {username: username});
 }   

 exports.processForm = async (req, res, next) => {
    const activity = req.body.activity;
    const email = req.session.email;
    //const username = req.session.username;
    const user = await userCollection.findOne({ email: email }); 
    const bmr = Number(user.healthinfo?.metabolism);
    
    console.log("activity: " + activity);
    console.log("email: " + email);
    console.log("user: " + user);
    console.log("user.healthinfo?.metabolism: " +user.healthinfo?.metabolism);
    console.log("bmr: " + bmr);
    // Multiply BMR by the appropriate activity factor to get TDEE (Total Daily Energy Expenditure)
    let tdee;

    switch (activity) {
        case 'sedentary':
            tdee = bmr * 1.2;
            break;
        case 'lightly-active':
            tdee = bmr * 1.375;
            break;
        case 'moderately-active':
            tdee = bmr * 1.55;
            break;
        case 'very-active':
            tdee = bmr * 1.725;
            break;
        case 'super-active':
            tdee = bmr * 1.9;
            break;
    }

    console.log ("tdee: " + tdee);
    userCollection.updateOne({ email: email }, {
        $set: { "healthinfo.tdee": tdee }
    });
    
    res.status(200);
    res.redirect('/calorieRequirement');  
 }
