const router = require('express').Router();
const Blog = require('../models/models');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.status(200).json(blogs);
});

router.get('/:id', async (request, response) => {
  const { id } = request.params;
  const blog = await Blog.findById(id);
  response.status(200).json(blog);
});

router.post('/', async (request, response) => {
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

router.delete('/:id', async (request, response) => {
  const { id } = request.params;

  await Blog.findByIdAndDelete(id);
  response.status(200).json('deleted').end();
});

router.put('/:id', async (request, response) => {
  const { title, likes = 0, url } = request.body;
  const { id } = request.params;

  const newblog = {
    title,
    url,
    likes,
  };

  const updatedblog = await Blog.findByIdAndUpdate(id, newblog, { new: true });
  response.status(200).json(updatedblog);
});

router.delete('/', async (request, response) => {
  await Blog.deleteMany();
  response.status(200).json('deleted').end();
});

module.exports = router;
