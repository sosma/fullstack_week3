const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}


const password = process.argv[2]

const url =
  `mongodb+srv://new-user_77:${password}@sosma0-dapp3.mongodb.net/test?retryWrites=true`


const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url, { useNewUrlParser: true })


const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})


if ( process.argv.length<4 ) {
  console.log('puhelinluettelo:')
  Person.find({}).then(result => {
  result.forEach(person => {
    console.log(`${person.name} ${person.number}`)
  })
  mongoose.connection.close()
})
} else {
person.save().then(response => {
  console.log(`lisätään ${process.argv[3]} numero ${process.argv[4]} luetteloon`);
  mongoose.connection.close();
})
}
