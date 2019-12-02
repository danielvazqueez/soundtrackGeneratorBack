const express = require('express')
const querystring = require('querystring')
const cors = require('cors');
const router = require('./routes')
const app = express()
const port = process.env.PORT || 8080
const request = require('request')

app.use(cors())
app.use(express.json()) // parsea a json
app.use(router)

app.listen(port, function() {
  console.log('Server up and running on port ' + port)
})
