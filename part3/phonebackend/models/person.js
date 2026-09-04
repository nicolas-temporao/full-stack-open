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

const numberValidator = (value) => {
  return /^\d{2,3}-\d+$/.test(value)
}
const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: { type: String, minLength: 8, required: true, validate: { validator: numberValidator, message: props => `${props.value} is not a valid phone number` } }
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