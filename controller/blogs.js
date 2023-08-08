const blogRouter = require('express').Router();
const Blog = require('../models/blogs');
const JWT = require('jsonwebtoken');

// GET ROUTE

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });
  response.status(200).json(blogs);
});

blogRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const blog = await Blog.findById(id);
  response.status(200).json(blog);
});

// POST ROUTE

blogRouter.post('/', async (request, response) => {
  const { title, url, likes = 0, author } = request.body;
  const user = request.user;

  if (!title || !url) {
    return response.status(400).json('content is missing');
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = [...user.blogs, savedBlog.id];
  await user.save();

  response.status(201).json(savedBlog).end();
});

// DELETE ROUTE

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = JWT.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json('unauthorized user');
  }

  const { id } = request.params;

  await Blog.findByIdAndDelete(id);
  response.status(200).json('deleted').end();
});

// UPDATE ROUTE

blogRouter.put('/:id', async (request, response) => {
  const decodedToken = JWT.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json('unauthorized user');
  }

  const { title, url } = request.body;
  const { id } = request.params;

  console.log(title, url, id);

  const existingBlog = await Blog.findById(id);
  const updatedLikes = existingBlog.likes + 1;

  const newblog = {
    title,
    url,
    likes: updatedLikes,
  };

  const updatedblog = await Blog.findByIdAndUpdate(id, newblog, {
    new: true,
  });
  response.status(200).json(updatedblog);
});

module.exports = blogRouter;
