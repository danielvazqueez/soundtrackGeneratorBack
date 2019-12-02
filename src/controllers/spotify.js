const CLIENT_ID = process.env.CLIENT_ID || require('../config').CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET || require('../config').CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8080/redirect'
const spotify_url = 'https://api.spotify.com/v1'
const querystring = require('querystring')
const request = require('request')


function publishPlaylist(req, res) {
  console.log("new publish playlist");
  const {token, movieName, soundtrack} = req.body;

  const headers = {
      Authorization: 'Bearer ' + req.body.token,
      'Content-Type': 'application/json'
  };

  try {

    getUser(headers, userId => {
      createPlaylist(headers, movieName, userId, newPlaylistId => {
        soundtrack.forEach(songName => {
          searchSong(headers, songName, songId => {
            addSongToPlaylist(headers, newPlaylistId, songId, (response) => {
              console.log(`song: ${songId} added to playlist: ${newPlaylistId}`);
            });
          });
        });
      });
    });

    res.send("Playlist creada exitosamente");

  } catch(err) {
    return res.status(401).send({ error: err });
  }
}

function getUser(headers, callback) {
  const userOptions = {
    url: `${spotify_url}/me`,
    headers
  }
  request(userOptions, (error, response) => {
    if(error) {
      throw error
    };
    const userId = JSON.parse(response.body).id;
    callback(userId);
  });
}

function createPlaylist(headers, movieName, userId, callback) {
    const options = {
      headers,
      json: {
        name: movieName
      }
    }
  
  request.post(`${spotify_url}/users/${userId}/playlists`, options,
               (error, response) => {
                 if(error) {
                   throw new Error(error);
                 }
                 console.log(response.body);

                 const playlistId = response.body.id;
                 callback(playlistId);
               });
}

function searchSong(headers, songName, callback) {
    const optionsSong = {
      headers,
      url: `${spotify_url}/search?` +
        querystring.stringify({
          q: songName,
          type: 'track',
          limit: 1
        }),
    }
    request(optionsSong,
           (error, response) => {
             if(error) {
               throw new Error(error);
             }
             const body = JSON.parse(response.body);
             if(body.tracks.total == 0) {
               return;
             }
             const songId = body.tracks.items[0].id;
             callback(songId);
           });
}

function addSongToPlaylist(headers, playlistId, songId, callback) {
    const options = {
      headers,
      json: {
        uris: ["spotify:track:" + songId]
      }
    }
  request.post(`${spotify_url}/playlists/${playlistId}/tracks`, options,
               (error, response) => {
                 if (error) {
                   throw new Error(error);
                 }
                 callback(response);
               });
}


module.exports = {
  publishPlaylist
}
