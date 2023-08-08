const express = require('express');
require('express-async-errors');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const blogRouter = require('./controller/blogs.js');
const userRouter = require('./controller/users.js');
const loginRouter = require('./controller/login.js');
const {
  errorHandeler,
  unknownEndpoint,
  requestLogger,
  tokenExtractor,
  userExtractor,
} = require('./utils/middleware.js');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(tokenExtractor);

app.use(requestLogger);
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
);

app.use('/api/blogs', userExtractor, blogRouter);
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controller/testing.js');
  app.use('/api/testing', testingRouter);
}

app.use(unknownEndpoint);
app.use(errorHandeler);

module.exports = app;
