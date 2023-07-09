const logger = require('./logger');
const JWT = require('jsonwebtoken');
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  logger.info('method', request.method);
  logger.info('Path', request.path);
  logger.info('body', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandeler = (error, request, response, next) => {
  logger.info(error.name);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('bearer ')) {
    request.token = authorization.replace('bearer ', '');
  }

  next();
};
const userExtractor = async (request, response, next) => {
  if (request.method === 'GET') {
    return next();
  }

  const decodedToken = JWT.verify(request.token, process.env.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json('Unauthorized user');
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(401).json('User not found');
  }

  request.user = user;
  next();
};

module.exports = {
  errorHandeler,
  unknownEndpoint,
  requestLogger,
  tokenExtractor,
  userExtractor,
};
