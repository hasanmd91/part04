const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blogs = require('../models/blogs');
const { helper, InitialBlogs } = require('../utils/helper_test');

const api = supertest(app);

let Token;
beforeAll(async () => {
  const user = {
    username: 'test123',
    password: 'test',
  };

  const USER = await api.post('/api/login').send(user).expect(200);
  Token = USER.body.token;
});

beforeEach(async () => {
  await Blogs.deleteMany({});
  let newBlog = new Blogs(InitialBlogs[0]);
  await newBlog.save();
  newBlog = new Blogs(InitialBlogs[1]);
  await newBlog.save({});
});

// Test HTTP GET request

describe('when there is initially some notes saved', () => {
  test('blogs are returned as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('All blogs are returned', async () => {
    const response = await helper.blogsInDb();
    expect(response).toHaveLength(InitialBlogs.length);
    expect(response[0].url).toBe('https://example.com');
    expect(response[0].title).toBe('Example 1');
  });

  test('should have defined blog IDs', async () => {
    const response = await helper.blogsInDb();
    response.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });

  test('A specific note is within the returned note', async () => {
    const response = await helper.blogsInDb();
    const blogs = response.map((blog) => blog.title);
    expect(blogs).toContain('Example 1');
  });
});

// Test HTTP GET request for specific blog

describe('viewing a specific note', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToView = blogsAtStart[0];

    const blogsAtEnd = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(blogToView).toEqual(blogsAtEnd.body);
  });

  test('fails with statuscode 400 if id is invalid', async () => {
    const InvalidId = '84382u232738234';

    await api.get(`/api/blogs/${InvalidId}`).expect(400);
  });
});

// Test HTTP POST request

describe('POST /api/blogs', () => {
  test('adding a blog will fail if user is unauthorized ', async () => {
    const user = {
      username: 'test12',
      password: 'test',
    };
    const USER = await api.post('/api/login').send(user).expect(401);
    const invalidToken = USER.body.token;
    expect(invalidToken).not.toBeDefined();
  });

  test('should add a valid blog', async () => {
    const newBlog = {
      title: 'Example 3',
      url: 'https://example.com',
      likes: 7,
    };

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${Token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await helper.blogsInDb();
    expect(response).toHaveLength(InitialBlogs.length + 1);
  });

  test('should add a blog with default likes as 0', async () => {
    const newBlog = {
      title: 'example title 1',
      url: 'https://example.com',
    };

    await api
      .post('/api/blogs')
      .set('authorization', `bearer ${Token}`)
      .send(newBlog)
      .expect(201);
    const response = await helper.blogsInDb();

    expect(response).toHaveLength(InitialBlogs.length + 1);
    expect(response[2].likes).toBe(0);
  });

  test('should return 400 when title and url are missing', async () => {
    const newBlog = {
      likes: 7,
    };

    await api.post('/api/blogs').send(newBlog).expect(400);
    const response = await helper.blogsInDb();
    expect(response).toHaveLength(InitialBlogs.length);
  });
});

// Test HTTP DELETE request

describe('DELETE /api/blogs', () => {
  test('should delete a blog with id', async () => {
    const blogs = await helper.blogsInDb();
    const id = blogs[0].id;
    const title = blogs[0].title;
    await api
      .delete(`/api/blogs/${id}`)
      .set('authorization', `bearer ${Token}`)
      .expect(200);
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(InitialBlogs.length - 1);
    const TitlesAtEnd = blogsAtEnd.map((blog) => blog.title);
    expect(TitlesAtEnd).not.toContain(title);
  });
});

// Test HTTP PUT request

describe('PUT /api/blogs', () => {
  test('should update a blog with id', async () => {
    const response = await helper.blogsInDb();
    const id = response[0].id;
    const updateBlog = {
      title: 'Example 1',
      author: 'Example',
      url: 'https://example.com',
    };

    await api
      .put(`/api/blogs/${id}`)
      .set('authorization', `bearer ${Token}`)
      .send(updateBlog)
      .expect(200);
    const result = await helper.blogsInDb();
    expect(result[0].title).toContain('Example 1');
    expect(result[0].url).toContain('https://example.com');
    expect(result[0].likes).toBe(6);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
