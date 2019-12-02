const mongoose = require('mongoose')

const connectionURL = process.env.CONNECTION_URL || require('../config').connectionURL

mongoose.connect( connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true
})