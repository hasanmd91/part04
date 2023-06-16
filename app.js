const express = require('express');
require('express-async-errors');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const router = require('./controller/blogs.js');
const {
  errorHandeler,
  unknownEndpoint,
  requestLogger,
} = require('./utils/middleware.js');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
);

app.use('/api/blogs', router);

app.use(unknownEndpoint);
app.use(errorHandeler);

module.exports = app;
