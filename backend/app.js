const express = require("express");
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const usersRouter = require('./routes/api/users'); // update the import file path
const tweetsRouter = require('./routes/api/tweets');
// const tweetsRouter = require('./routes/api/trips');

const app = express();

app.use(logger('dev')); // log request components (URL/method) to terminal
app.use(express.json()); // parse JSON request body
app.use(express.urlencoded({ extended: false })); // parse urlencoded request body
app.use(cookieParser()); // parse cookies as an object on req.cookies

// Attach Express routers
app.use('/api/users', usersRouter); // update the path
app.use('/api/tweets', tweetsRouter);
// app.use('/api/trips', tripsRouter);

module.exports = app;
