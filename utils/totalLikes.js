const totalLikes = (blogs) => {
  if (blogs.length <= 0) return 0;

  return blogs.reduce((acc, res) => {
    acc = acc + res.likes;
    return acc;
  }, 0);
};

module.exports = totalLikes;
