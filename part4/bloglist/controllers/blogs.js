const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})


blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  blog.likes ??= 0
  if (!blog.title || !blog.url){
    return response.status(400).end()
  }
  const result = await blog.save()
  response.status(201).json(result)
})

blogRouter.delete('/:id', async (request,response) => {
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