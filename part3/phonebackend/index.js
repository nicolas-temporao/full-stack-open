const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('body', (request)=> {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phoneEntries = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
app.get('/', (request,response) => {
    response.send("<p>Main page</p>")
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${phoneEntries.length} people<p>
    <p>${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(phoneEntries)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const entry = phoneEntries.find(entry => entry.id === id)

  if (entry) {
     response.json(entry)
  } else {
    response.status(404).end()
  }
 
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phoneEntries = phoneEntries.filter(entry => entry.id !== id)

  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number is missing'})
    }


    if (phoneEntries.some(entry => entry.name === body.name)) {
         return response.status(400).json({ error: 'name must be unique'})
    }


    const person = {
        id: Math.floor(Math.random() * 10000).toString(),
        name: body.name,
        number: body.number 
    }   
    phoneEntries = phoneEntries.concat(person)
    response.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})