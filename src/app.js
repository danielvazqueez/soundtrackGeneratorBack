const express = require('express')
const cors = require('cors');
require('./db/mongoose')
const router = require('./routes')
const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(express.json()) // parsea a json
app.use(router)

app.listen(port, function() {
  console.log('Server up and running on port ' + port)
})
