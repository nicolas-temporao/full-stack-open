const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }
]

const newBlog = {
    "title": "New Blog Post",
    "author": "Nick",
    "url": "https://example.com",
    "likes": 2
}

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('blogs are returned as JSON', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all blogs returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('unique identifier is id', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)

    response.body.forEach(blog => {
        assert.ok(blog.id)
    })
})

test('creation of new blog post works', async () => {
    await api
        .post('/api/blogs').send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    
    const titleList = response.body.map(blog => blog.title)
    assert(titleList.includes('New Blog Post'))
})

after (async () => {
    await mongoose.connection.close()
})