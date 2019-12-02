const express = require('express')
const router = express.Router()

const users = require('./controllers/users.js')
const movies = require('./controllers/movies.js')
const spotify = require('./controllers/spotify.js')
const auth = require('./middleware/auth')

router.get('/users', auth, users.getUser)
router.post('/users/login', users.login)
router.post('/logout', auth, users.logout)
router.post('/users', users.createUser)  // signup
router.patch('/users', auth, users.updateUser)
router.delete('/users', auth, users.deleteUser)

router.post('/spotify/publishPlaylist', auth, spotify.publishPlaylist)

router.get('/movies', auth, movies.getMovies)
router.post('/movies', auth, movies.createMovie)

router.get('*', function(req, res) {
  res.send({
    error: 'This route does not exist, try /users or /spotify'
  })
})

module.exports = router

