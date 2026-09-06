const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})


blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  
  const user = request.user
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: user._id
  })

  if (!blog.title || !blog.url) {
    return response.status(400).end()
  }

  const savedBlog =  await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request,response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only blog creator can delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


blogRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const updateBlog = await Blog.findById(request.params.id)
  if (!updateBlog) {
    return response.status(404).end()
  }
  updateBlog.likes = likes

  await updateBlog.save()
  response.json(updateBlog)
})

module.exports = blogRouter