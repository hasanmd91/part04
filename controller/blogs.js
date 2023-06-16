const router = require('express').Router();
const Blog = require('../models/models');

router.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.status(200).json(blogs);
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

router.delete('/', async (request, response) => {
  await Blog.deleteMany();
  response.status(201).json('deleted').end();
});

module.exports = router;
