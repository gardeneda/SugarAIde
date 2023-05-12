const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

exports.createHTML = async (req, res, next) => {

        var email = req.session.email;

        // Find the user with the given username
        const user = await userCollection.findOne({ email: email });

        if (!user) {
            res.send("User not found");
            return;
        }
        // Render the profile view with the user data
        res.render('profile', {
            username: user.username,
            email: user.email,
            height: user.healthinfo?.height,
            weight: user.healthinfo?.weight,
            gender: user.healthinfo?.gender,
            age: user.healthinfo?.age,
            risk: (user.healthinfo?.risk).toFixed(1) * 100
        });
}