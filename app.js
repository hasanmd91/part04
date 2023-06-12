const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const router = require('./controller/blogs.js');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(
    ':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'
  )
);

app.use('/api/blogs', router);

module.exports = app;
