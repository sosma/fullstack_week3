const mongoose = require('mongoose')

const url = 'mongodb+srv://new-user_77:moi123@sosma0-dapp3.mongodb.net/test?retryWrites=true'
console.log('commecting to', url)
mongoose.connect(url, { useNewUrlParser: true })
  .then(result => {
          console.log('connected to MongoDB')
        })
          .catch((error) => {
                  console.log('error connection to MongoDB:', error.message)
          })
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
