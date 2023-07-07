const blogRouter = require('express').Router();
const Blog = require('../models/models');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.status(200).json(blogs);
});

blogRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const blog = await Blog.findById(id);
  response.status(200).json(blog);
});

blogRouter.post('/', async (request, response) => {
  const { title, url, likes = 0 } = request.body;

  if (!title || !url) {
    return response.status(400).json('content is missing');
  }

  const blog = new Blog({
    title,
    url,
    likes,
  });

  const newBlog = await blog.save();
  response.status(201).json(newBlog).end();
});

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  await Blog.findByIdAndDelete(id);
  response.status(200).json('deleted').end();
});

blogRouter.put('/:id', async (request, response) => {
  const { title, likes, url } = request.body;
  const { id } = request.params;

  const existingBlog = await Blog.findById(id);
  const updatedLikes = existingBlog.likes + likes;

  const newblog = {
    title,
    url,
    likes: updatedLikes,
  };

  const updatedblog = await Blog.findByIdAndUpdate(id, newblog, { new: true });
  response.status(200).json(updatedblog);
});

blogRouter.delete('/', async (request, response) => {
  await Blog.deleteMany();
  response.status(200).json('deleted').end();
});

module.exports = blogRouter;
