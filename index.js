const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()

app.use(cors())
//use tiny
// app.use(morgan('tiny'))

morgan.token('body', (req) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
let persons = [
  {
    id: 1,
    name: 'name1',
    number: '150123456789'
  },
  {
    id: 2,
    name: 'name2',
    number: '250123456789'
  },
  {
    id: 3,
    name: 'name3',
    number: '350123456789'
  },
]

app.use(bodyParser.json())

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(100000000000));
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/info/', (req, res) => {
  const length = persons.length
  const date = new Date()
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  res.end(`puhelinluettelossa on ${length} henkilön tiedot\n${date}`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (body.name === undefined || body.number == undefined) {
    return res.status(400).json({ error: 'name or number missing' })
  }
  var names = persons.map(person => person.name)
  if (names.indexOf(body.name) != -1) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
