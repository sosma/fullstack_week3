if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static('build'))
app.use(cors())
//use tiny
// app.use(morgan('tiny'))

morgan.token('body', (req) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {    return response.status(400).json({ error: error.message })  }

  next(error)
}

app.use(errorHandler)
app.use(bodyParser.json())

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(100000000000));
}



app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info/', (req, res) => {
  const date = new Date()
  res.set({ 'content-type': 'application/json; charset=utf-8' });
  Person.find({}).then(persons => { persons
    res.end(`puhelinluettelossa on ${persons.length} henkilön tiedot\n${date}`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
   if (person) {
       response.json(person.toJSON())
   } else {
       response.status(404).end()
   }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
  })

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
