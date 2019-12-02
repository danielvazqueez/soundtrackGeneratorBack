const mongoose = require('mongoose')

const connectionURL = process.env.connectionURL || require('../config').connectionURL

mongoose.connect( connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true
})