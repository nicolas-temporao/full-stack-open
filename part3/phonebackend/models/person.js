const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)


console.log('Connecting to MongoDB...')
mongoose.connect(url, { family: 4 })
    .then(() => {
        console.log('Connected.')
    })
    .catch(error => {
        console.log('error connecting:', error.message)   
    })

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: String
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema) 

module.exports = Person