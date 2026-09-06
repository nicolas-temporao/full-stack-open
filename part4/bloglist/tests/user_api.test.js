const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const assert = require('node:assert')

const api = supertest(app)

const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    passwordHash: 'hash1'
  },
  {
    username: 'nick',
    name: 'Nick Temp',
    passwordHash: 'hash2'
  }
]

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
})

describe('Creating new users', () => {
    test('creating user with username already in database', async () => {
        const newUser = { username: 'nick', name: 'imposter', password: 'password'}
        await api
        .post('/api/users').send(newUser)
        .expect(400)

        const usersAfter = await User.find({})
        assert.strictEqual(usersAfter.length, initialUsers.length)
    })

})

after (async () => {
    await mongoose.connection.close()
})