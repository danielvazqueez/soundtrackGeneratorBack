const express = require('express')
const router = express.Router()

const users = require('./controllers/users.js')
const auth = require('./middleware/auth')

router.get('/users', auth, users.getUser)
router.post('/users/login', users.login)
router.post('/logout', auth, users.logout)
router.post('/users', users.createUser)  // signup
router.patch('/users', auth, users.updateUser)
router.delete('/users', auth, users.deleteUser)

router.get('*', function(req, res) {
  res.send({
    error: 'This route does not exist, try /users or /todos'
  })
})

module.exports = router

