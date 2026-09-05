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

test('likes property defaults to 0 if missing', async () => {
    const { likes, ...noLikesBlog} = newBlog

    const response = await api
        .post('/api/blogs').send(noLikesBlog)
        .expect(201)

    assert.strictEqual(response.body.likes, 0)
})

test('blog without title is rejected', async () => {
    const { title, ...noTitleBlog} = newBlog
    await api
        .post('/api/blogs').send(noTitleBlog)
        .expect(400)
})

test('blog without url is rejected', async () => {
    const { url, ...noUrlBlog} = newBlog
    await api
        .post('/api/blogs').send(noUrlBlog)
        .expect(400)
})

test('deleting a blog', async () => {
    const blogsBeforeDelete = await api.get('/api/blogs')
    const blogToDelete = blogsBeforeDelete.body[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)
    const blogsAfter = await api.get('/api/blogs')

    assert.strictEqual(blogsAfter.body.length, initialBlogs.length - 1)

    const titles = blogsAfter.body.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
})

test('updating likes of a blog', async () => {
    const blogs = await api.get('/api/blogs')
    const updateBlog = blogs.body[0]

    const updatedLikes = updateBlog.likes + 1

    const response = await api.put(`/api/blogs/${updateBlog.id}`).send({ likes: updatedLikes })
    .expect(200)

    assert.strictEqual(response.body.likes, updatedLikes)
})

after (async () => {
    await mongoose.connection.close()
})