const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  const grouped = lodash.groupBy(blogs, 'author')
  const entries = Object.entries(grouped)
  
  const mostBlogsEntry = lodash.maxBy(
    entries,
    entry => entry[1].length
  )

  if (!mostBlogsEntry){
    return null
  }

  return {
    author: mostBlogsEntry[0],
    blogs: mostBlogsEntry[1].length
  }
}

const mostLikes = (blogs) => {
  const grouped = lodash.groupBy(blogs, 'author')
  const entries = Object.entries(grouped)

  const mostLikesEntry = lodash.maxBy(entries, ([, authorBlogs]) => {
    return lodash.sumBy(authorBlogs, 'likes')
  })

  if (!mostLikesEntry) {
    return null
  }

  const [author, authorBlogs] = mostLikesEntry

  return {
    author,
    likes: lodash.sumBy(authorBlogs, 'likes')
  }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}