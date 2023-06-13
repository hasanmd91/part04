const mongoose = require('mongoose');
const config = require('./utils/config');

mongoose.set('strictQuery', false);
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    'connected to mongodb';
  })
  .catch((error) =>
    console.log(`error connecting to mongodb: ${error.message}`)
  );

module.exports = mongoose;
