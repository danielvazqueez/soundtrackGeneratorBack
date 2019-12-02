const Movie = require('../models/movie')
const OmdpApiKey = process.env.OMDB_API_KEY || require('../config').OMDB_API_KEY

const getMovies = function(req, res) {
  Movie.find({}).then(function(movies) {
    res.send(movies)
  }).catch(function(error){
    res.status(400).send(error)
  })
}

const createMovie = function(req, res){
  console.log(req)
  const url = 'http://www.omdbapi.com/?apikey=' + OmdpApiKey + '&t=' + req.body.title

	request(url, function(error, response) {
		if (error) {
      return res.status(401).send({ error: error })
		} else {
			const data = response.body
			if (data.Response == 'False') {
        return res.status(401).send({ error: data.Error })
			} else {
				const info = {
					name: data.Title,
					imdbId: data.imdbID
				}
			}
		}
	})
  // TODO: Add scraping for soundtrack
  const movie = new Movie(info)
  movie.save().then(function() {
    return res.send(movie)
  }).catch(function(error) {
    return res.status(400).send(error)
  })
}

module.exports = {
  getMovies,
  createMovie
}