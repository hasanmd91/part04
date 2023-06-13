const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blogs = require('../models/models');

const api = supertest(app);

const InitialBlogs = [
  { title: 'Example 1', url: 'https://example.com', likes: 5 },
  { title: 'Example 2', url: 'https://example.com', likes: 6 },
];

beforeEach(async () => {
  await Blogs.deleteMany({});
  let newBlog = new Blogs(InitialBlogs[0]);
  await newBlog.save();
  newBlog = new Blogs(InitialBlogs[1]);
  await newBlog.save({});
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(InitialBlogs.length);
});

test('the first blog url is example.com', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].url).toBe('https://example.com');
});

test('the first blog title is Example 1', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].title).toBe('Example 1');
}, 100000);

afterAll(async () => {
  await mongoose.connection.close();
});

//http = hyper text transfer protocol
//used for data transfering over network
