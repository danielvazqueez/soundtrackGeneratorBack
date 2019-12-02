const CLIENT_ID = process.env.CLIENT_ID || require('../config').CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET || require('../config').CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI || "http://localhost:8080/spotify/redirect"
const spotify_url = 'https://api.spotify.com/v1'
const querystring = require('querystring')
const request = require('request')


const requestToken = (req, res) => {
  const scopes = 'playlist-modify-public playlist-read-private'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scopes,
      redirect_uri: redirect_uri,
      movieName: req.query.movieName
    }));
}

const redirect = (req, res) => {
  var auth_encoded = new Buffer(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
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
        },
        body: {
          name: req.query.movieName
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
}

module.exports = {
  requestToken,
  redirect
}