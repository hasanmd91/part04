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
  expect(response.body[0].url).toBe('https://example.com');
  expect(response.body[0].title).toBe('Example 1');
});

test('blog id is defined', async () => {
  const response = await api.get('/api/blogs').expect(200);
  response.body.map((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Example 3',
    url: 'https://example.com',
    likes: 7,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(InitialBlogs.length + 1);
});

test('blog without likes gets default like 0', async () => {
  const newBlog = {
    title: 'example title 1',
    url: 'https://example.com',
  };

  await api.post('/api/blogs').send(newBlog).expect(201);
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(InitialBlogs.length + 1);
  expect(response.body[2].likes).toBe(0);
});

test('blog without title and url gets response 400', async () => {
  const newBlog = {
    likes: 7,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);
  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(InitialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
