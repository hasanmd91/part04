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

afterAll(async () => {
  await mongoose.connection.close();
});

// Test HTTP GET request

describe('GET /api/blogs', () => {
  test('should return blogs as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('should return two blogs', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(InitialBlogs.length);
    expect(response.body[0].url).toBe('https://example.com');
    expect(response.body[0].title).toBe('Example 1');
  });

  test('should have defined blog IDs', async () => {
    const response = await api.get('/api/blogs').expect(200);
    response.body.map((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

// Test HTTP POST request

describe('POST /api/blogs', () => {
  test('should add a valid blog', async () => {
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

  test('should add a blog with default likes as 0', async () => {
    const newBlog = {
      title: 'example title 1',
      url: 'https://example.com',
    };

    await api.post('/api/blogs').send(newBlog).expect(201);
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(InitialBlogs.length + 1);
    expect(response.body[2].likes).toBe(0);
  });

  test('should return 400 when title and url are missing', async () => {
    const newBlog = {
      likes: 7,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(InitialBlogs.length);
  });
});

// Test HTTP DELETE request

describe('DELETE /api/blogs', () => {
  test('should delete a blog with id', async () => {
    const blogs = await api.get('/api/blogs');
    const id = blogs.body[0].id;
    const title = blogs.body[0].title;
    await api.delete(`/api/blogs/${id}`).expect(200);
    const blogsAtEnd = await api.get('/api/blogs');
    expect(blogsAtEnd.body).toHaveLength(InitialBlogs.length - 1);
    const TitlesAtEnd = blogsAtEnd.body.map((blog) => blog.title);
    expect(TitlesAtEnd).not.toContain(title);
  });
});

// Test HTTP PUT request

describe('PUT /api/blogs', () => {
  test('should update a blog with id', async () => {
    const response = await api.get('/api/blogs');
    const id = response.body[0].id;
    const updateBlog = {
      title: 'example title 10',
      url: 'https://example.com',
      likes: 5,
    };

    await api.put(`/api/blogs/${id}`).send(updateBlog).expect(200);
    const result = await api.get('/api/blogs');
    expect(result.body[0].title).toContain('example title 10');
    expect(result.body[0].url).toContain('https://example.com');
    expect(result.body[0].likes).toBe(10);
  });
});
