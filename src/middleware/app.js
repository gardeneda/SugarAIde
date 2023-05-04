// This page is EXPRESS / MIDDLEWARE Only
const express = require('express');
const morgan = require('morgan');
const app = express();

const botRouter = require(`${__dirname}/../routes/botRouter`);

// Morgan is a development dependency that allows us to visualize status codes better
// for API tests. 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/v1/chat/test', botRouter);

module.exports = app;
