require('dotenv').config();

const PORT = 3001;
const MONGODB_URI = process.env.MONGODB_URL;

module.exports = { PORT, MONGODB_URI };
