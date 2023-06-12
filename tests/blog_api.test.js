const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const api = supertest(app);

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(2);
});

test('the first blogs is about HTTP methods', async () => {
  const response = await api.get('/api/notes');

  expect(response.body[0].title).toBe('Example deo tests 2');
});

afterAll(async () => {
  await mongoose.connection.close();
});
