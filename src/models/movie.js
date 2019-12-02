const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  imdbId: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  description: {
    type: String
  },
  soundtrack: [
    String
  ]
    // song: {
    //   type: String,
    //   required: true
    // },
    // songId: {
    //   type: String,
    //   required: true
    // }
    // ]
},{
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true 
  }
})


movieSchema.methods.toJSON = function() {
  const movie = this
  const movieObject = movie.toObject()

  return movieObject
}

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie

