const jwt = require('jsonwebtoken')
const User = require('../models/user')

const secret = process.env.SECRET || require('../config').secret
const auth = function( req, res, next ) {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, secret)
    User.findOne({ _id: decoded._id, 'tokens.token': token }).then(function(user) {
      if(!user) {
        throw new Error()
      }
      req.token = token
      req.user = user
      next()
    }).catch(function(error) {
      res.status(401).send({ error: 'Please authenticate'})
    })
  } catch(e) {
    res.status(401).send({ error: 'Please authenticate'})
  }
}

module.exports = auth