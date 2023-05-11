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
        if (!req.session.authenticated) {
            res.send("Must log-in");
            //res.redirect(/login);
            return;
        } else {
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
                risk: user.healthinfo?.risk
            });

        }
    }
    exports.changePassword = async (req, res, next) => {
        const { currentPassword, newPassword } = req.body;
    
        if (!req.session.authenticated) {
            res.send("Must log-in");
            return;
        }
    
        var email = req.session.email;
    
        // Find the user with the given username
        const user = await userCollection.findOne({ email: email });
    
        if (!user) {
            res.send("User not found");
            return;
        }
    
        const match = await bcrypt.compare(currentPassword, user.password);
    
        if (!match) {
            console.log("password is not matched");
            res.status(400).send('Current password is incorrect');
            return;
        }
    
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        await userCollection.updateOne(
            { email: email },
            { $set: { password: hashedPassword } }
        );
    
        res.send("Password changed successfully");
        res.redirect("/profile");
    }