const crypto = require('crypto');
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

// For JSON Web Tokens to reset password
const jwt = require("jsonwebtoken");

/* End Secret Information Section */
const JWT_SECRET = process.env.JWT_SECRET;


// For sending emails
const nodemailer = require("nodemailer");


const database = require(`${__dirname}/../config/databaseConfig`);
const userCollection = database
    .db(process.env.MONGODB_DATABASE)
    .collection("users");

exports.createHTML = (req, res) => {
    var msg = req.query.msg || '';
    res.render('forgotPassword', { msg : msg })
};

exports.forgotPassword = async (req, res, next) => {
    var msg = req.query.msg || '';
    // Get email
    const { email } = req.body;
    console.log(email);

    // Check email
    const user = await userCollection.findOne({ email: email });

    console.log("user:" +user);

    if (!user) {
        return res.status(404).send({ msg : 'No account with that email address exists.'});
    } else {
        const secret = JWT_SECRET + user.password;
        const payload = {
            email: email,
            id: user._id
        };
        const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    //Email a link to reset password
    const resetURL = `http://${req.headers.host}/resetPassword/${user._id}/${token}`;

    const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;

    const smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SUGARAIDE_SUPPORT_EMAIL,
            pass: process.env.SUGARAIDE_SUPPORT_PASSWORD,
        },
    });

    const mailOptions = {
        from: `"SugarAIde" <${process.env.SUGARAIDE_SUPPORT_EMAIL}>`, // Sender address
        to: user.email, // Recipient address
        subject: 'SugarAIde Password Recovery', // Subject line
        html: message 
    };

    smtpTransport.sendMail(mailOptions, (err) => {
        if (err) return next(err);
        //res.send({ msg : 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        res.render('forgotPassword', { msg : 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
    });

    }
};
