const blogRouter = require('express').Router();
const Blog = require('../models/blogs');
const User = require('../models/user');
const JWT = require('jsonwebtoken');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });
  response.status(200).json(blogs);
});

blogRouter.get('/:id', async (request, response) => {
  const { id } = request.params;
  const blog = await Blog.findById(id);
  response.status(200).json(blog);
});

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('bearer ')) {
    return authorization.replace('bearer ', '');
  }
  return null;
};

blogRouter.post('/', async (request, response) => {
  console.log(request);
  const decodedToken = JWT.verify(getTokenFrom(request), process.env.SECRET);
  console.log('this is decoded token ', decodedToken);
  if (!decodedToken.id) {
    return response.status(401).json('Token Invalid');
  }
  const user = await User.findById(decodedToken.id);

  const { title, url, likes = 0, author } = request.body;

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
