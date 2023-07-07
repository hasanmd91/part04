const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const helper = {
  userinDb: async () => {
    const response = await api.get('/api/users');
    return response.body;
  },
};

module.exports = helper;
