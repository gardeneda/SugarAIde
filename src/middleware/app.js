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

const chatRouter = require(`${__dirname}/../routes/chatRouter`);
const healthInfoRouter = require(`${__dirname}/../routes/healthInfoRouter`);
const signupRouter = require(`${__dirname}/../routes/signupRouter`);
const loginRouter = require(`${__dirname}/../routes/loginRouter`);
const mainRouter = require(`${__dirname}/../routes/mainRouter`);
const profileRouter = require(`${__dirname}/../routes/profileRouter`);
const riskAssessRouter = require(`${__dirname}/../routes/riskAssessRouter`);
const exerciseRouter = require(`${__dirname}/../routes/exerciseRouter`);
const exerciseFormRouter = require(`${__dirname}/../routes/exerciseFormRouter`);


// app.set('views', path.join(__dirname, 'src', 'views'));

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
app.use("/css", express.static(`${__dirname}/../../public/css`));


app.use("/font", express.static(`${__dirname}/../../public/font`));

app.use("/css", express.static(`${__dirname}/../../public/css`));

app.use("/img", express.static(`${__dirname}/../../public/img`));

app.use("/js", express.static(`${__dirname}/../../public/js`));

app.use("/chat", chatRouter);

app.use("/signup", signupRouter);

app.use("/login", loginRouter);

app.use("/main", mainRouter);

app.use("/profile", profileRouter);

app.use("/health", healthInfoRouter);

app.use("/risk", riskAssessRouter);

app.use("/exercisePage", exerciseRouter);

app.use("/exerciseForm", exerciseFormRouter);



app.use("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/", (req, res) => {
  if (req.session.authenticated) {
    res.render('main');

  } else {
    res.render("home");
  }
});

app.get("*", (req, res) => {
  const html = `
		<h2>Page Does Not Exist - 404 </h2>
    <img src='./images/sadrobot.png'>
		</br>
		<a href='/'>Go back to main</a>
	`;

  res.status(404);
  res.send(html);
});

module.exports = app;


