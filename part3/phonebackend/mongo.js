const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({ name: String, number: String })

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  const password = process.argv[2]
  const url = `mongodb://fullstack:${password}@ac-zsyhmzr-shard-00-00.kuowten.mongodb.net:27017,ac-zsyhmzr-shard-00-01.kuowten.mongodb.net:27017,ac-zsyhmzr-shard-00-02.kuowten.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-jleaqc-shard-0&authSource=admin&appName=Cluster0`
  mongoose.connect(url, { family:4 })
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close()
    })

} else if (process.argv.length === 5) {
  const password = process.argv[2]
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name, number
  })

  const url = `mongodb://fullstack:${password}@ac-zsyhmzr-shard-00-00.kuowten.mongodb.net:27017,ac-zsyhmzr-shard-00-01.kuowten.mongodb.net:27017,ac-zsyhmzr-shard-00-02.kuowten.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-jleaqc-shard-0&authSource=admin&appName=Cluster0`
  mongoose.connect(url, { family:4 })
  person.save().then(() => {
    console.log(`Added: ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })

} else {
  console.log('usage:')
  console.log('node mongo.js <password> OR node mongo.js <password> <name> <number>')
  process.exit(1)
}





