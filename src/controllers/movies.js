const Movie = require('../models/movie')
const OmdpApiKey = process.env.OMDB_API_KEY || require('../config').OMDB_API_KEY
const request = require('request')
const rp = require('request-promise');
const $ = require('cheerio');
const getMovies = function(req, res) {
  Movie.find({}).then(function(movies) {
    res.send(movies)
  }).catch(function(error){
    res.status(400).send(error)
  })
}

const getSoundtrack = async (ttImdb) => {
  const url = `https://www.imdb.com/title/${ttImdb}/soundtrack`;

  return rp(url)
    .then(function(html){
      const songs = []
      //success!
      for (let i = 0; i < $('.list > .soundTrack', html).length; i++) {
        console.log($('.list > .soundTrack', html)[i].children[0].data)
        songs.push($('.list > .soundTrack', html)[i].children[0].data.trim())
      }
      return songs
    })
    .catch(function(err){
      console.log(err)
    });
}

const createMovie = function(req, res){
  console.log(req.body.title)
  const url = 'http://www.omdbapi.com/?apikey=' + OmdpApiKey + '&t=' + req.body.title
	request({url, json : true}, async function(error, response) {
		if (error) {
      return res.status(401).send({ error: error })
		} else {
			const data = response.body
			if (data.Response == 'False') {
        return res.status(402).send({ error: data.Error })
			} else {
        const songs = await getSoundtrack(data.imdbID)
        const info = {
					name: data.Title,
          imdbId: data.imdbID,
          imageUrl: data.Poster,
          description: data.Plot,
          soundtrack: songs
        }
        const movie = new Movie(info)
        movie.save().then(function() {
          return res.send(movie)
        }).catch(function(error) {
          return res.status(400).send(error)
        })
			}
		}
	})
}

module.exports = {
  getMovies,
  createMovie
}