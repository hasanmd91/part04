const config = require('./utils/config.js');
const app = require('./app.js');

app.listen(config.PORT, () =>
  console.log(`Server is listening on ${config.PORT}`)
);
