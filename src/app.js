const express = require('express')
const Base64 = require('js-base64').Base64
const querystring = require('querystring')
const cors = require('cors');
const router = require('./routes')
const app = express()
const port = process.env.PORT || 3000
const CLIENT_ID = process.env.CLIENT_ID || require('../config').CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET || require('../config').CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI || "http://localhost:3000/redirect"
const spotify_url = 'https://api.spotify.com/v1'
const request = require('request')

app.use(cors())
app.use(express.json()) // parsea a json
app.use(router)

app.get('/spotify', function(req, res) {
  const scopes = 'playlist-modify-public playlist-read-private'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scopes,
      redirect_uri: redirect_uri
    }));
})

app.get('/redirect', (req, res) => {
  var auth_encoded = Base64.encode(`${CLIENT_ID}:${CLIENT_SECRET}`)
  const options = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: req.query.code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      Authorization: 'Basic ' + auth_encoded
    },
    json: true
  }
  request.post(options, (error, response) => {
    if (error) {
      return res.status(401).send({ error: error })
    }
    console.log(response.body)
    request.get('https://api.spotify.com/v1/me', (error2, response2) => {
      if (error2) {
        return res.status(401).send({ error: error })
      }
      const options = {
        url: `${spotify_url}/users/${response2.id}/playlists`,
        headers: {
          Authorization: 'Bearer ' + response.body.access_token,
          'Content-Type': 'application/json'               
        }
      }
      request.post(options, (error3, response3) => {
        if (error3) {
          return res.status(401).send({ error: error })
        }
        return res.send(response3.body)
      })
    })
  })
})
app.listen(port, function() {
  console.log('Server up and running on port ' + port)
})
