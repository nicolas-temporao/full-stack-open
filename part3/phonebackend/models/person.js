const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('StrictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({ name: String, number: String })

const Person = mongoose.model('Person', personSchema) 

module.exports = Person