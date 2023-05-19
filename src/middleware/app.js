// This page is EXPRESS / MIDDLEWARE Only
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const MongoStore = require('connect-mongo');
const path = require("path");
const app = express();

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;

const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;
const node_session_secret = process.env.NODE_SESSION_SECRET;

const todoController = require(`${__dirname}/../controllers/todoController`);
const dateFormatter = require(`${__dirname}/../utils/dateFormatter`);

const navLinks = require(`${__dirname}/../utils/navLinkManager.js`);
const { highlightCurrentLink } = require(`${__dirname}/../utils/navLinkManager.js`); 
const chatRouter = require(`${__dirname}/../routes/chatRouter`);
const healthInfoRouter = require(`${__dirname}/../routes/healthInfoRouter`);
const signupRouter = require(`${__dirname}/../routes/signupRouter`);
const loginRouter = require(`${__dirname}/../routes/loginRouter`);
const mainRouter = require(`${__dirname}/../routes/mainRouter`);
const profileRouter = require(`${__dirname}/../routes/profileRouter`);
const riskAssessRouter = require(`${__dirname}/../routes/riskAssessRouter`);
const exerciseRouter = require(`${__dirname}/../routes/exerciseRouter`);
const exerciseFormRouter = require(`${__dirname}/../routes/exerciseFormRouter`);
const forgotPasswordRouter = require(`${__dirname}/../routes/forgotPasswordRouter`);
const resetPasswordRouter = require(`${__dirname}/../routes/resetPasswordRouter`);
const checkCaloriesRouter = require(`${__dirname}/../routes/checkCaloriesRouter`);
const calorieRequirmentRouter = require(`${__dirname}/../routes/calorieRequirmentRouter`);
const foodHistoryRouter = require(`${__dirname}/../routes/foodHistoryRouter`);
const additionalInfoRouter = require(`${__dirname}/../routes/additionalInfoRouter`);
const todoRouter = require(`${__dirname}/../routes/todoRouter`);
const dietTrackRouter = require(`${__dirname}/../routes/dietTrackRouter`);

app.set('views', path.resolve(`${__dirname}/../views`));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Morgan is a development dependency that allows us to visualize status codes better
// for API tests. 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
  crypto: {
    secret: mongodb_session_secret,
  },
});

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore, //default is memory store
    saveUninitialized: false,
    resave: true,
  })
);

// EJS creates a "locals" parameter on app.
// We can set this to create 'global' variables that
// EJS scripts can refer to.
app.use("/", async (req, res, next) => {
  // const thisURL = new URL(req.url);
	if (!req.session.authenticated) {

		app.locals.status = 0;

  } else {

    // To insert template into main (Suggestions)
    const today = dateFormatter.getToday();
    let checkboxes = await todoController.fetchCheckboxes(req.session.email, today);

    if (checkboxes != null) {
      app.locals.todo = 1;
      app.locals.checkboxes = checkboxes;

    } else {
      app.locals.todo = 0;
    }

		app.locals.status = 1;
	}


  //app.locals.navLinks = navLinks;
  //app.locals.currentURL = req.path;

  const currentURL = req.path; 
  const highlightedLinks = highlightCurrentLink(currentURL); 
  app.locals.navLinks = highlightedLinks;

	next();
});

app.get("/", (req, res) => {
  if (req.session.authenticated) {
    res.render('main');

  } else {
    res.render("home");
  }
});


app.use("/css", express.static(`${__dirname}/../../public/css`));

app.use("/font", express.static(`${__dirname}/../../public/font`));

app.use("/css", express.static(`${__dirname}/../../public/css`));

app.use("/img", express.static(`${__dirname}/../../public/img`));

app.use("/js", express.static(`${__dirname}/../../public/js`));

app.use("/chat", chatRouter);

app.use("/signup", signupRouter);

app.use("/login", loginRouter);

app.use("/forgotPassword", forgotPasswordRouter);

app.use("/resetPassword", resetPasswordRouter);

app.use("/main", mainRouter);

app.use("/profile", profileRouter);

app.use("/health", healthInfoRouter);

app.use("/risk", riskAssessRouter);

app.use("/additionalInfo", additionalInfoRouter);

app.use("/exercisePage", exerciseRouter);

app.use("/exerciseForm", exerciseFormRouter);

app.use("/checkCalories", checkCaloriesRouter);

app.use("/calorieRequirement", calorieRequirmentRouter);

app.use("/foodHistory", foodHistoryRouter);

app.use("/todo", todoRouter);

app.use("/dietTrack", dietTrackRouter);

app.use("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("*", (req, res) => {
  const html = `
		<h1>Error 404 - Sorry this page Does Not Exist </h1>
    <img width="500px" height="500px" src='/img/do-the-robot.gif'>
		<br>
		<a href='/'>Go back to main</a>
	`;

  res.status(404);
  res.send(html);
});

module.exports = app;


