const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const helper = {
  userinDb: async () => {
    const response = await api.get('/api/users');
    return response.body;
  },

  blogsInDb: async () => {
    const response = await api.get('/api/blogs');
    return response.body;
  },
};

const InitialBlogs = [
  {
    title: 'Example 1',
    author: 'Example',
    url: 'https://example.com',
    likes: 5,
  },
  {
    title: 'Example 2',
    author: 'Example',
    url: 'https://example.com',
    likes: 6,
  },
];

module.exports = { helper, InitialBlogs };
