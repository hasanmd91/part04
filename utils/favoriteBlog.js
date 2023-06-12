const favoriteBlog = (blogs) => {
  let maxLikes = 0;
  let favorite = null;

  blogs.forEach((blog) => {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes;
      favorite = blog;
    }
  });
  return favorite;
};

module.exports = favoriteBlog;
