const CLIENT_ID = process.env.CLIENT_ID || require('../config').CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET || require('../config').CLIENT_SECRET
const redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8080/redirect'
const spotify_url = 'https://api.spotify.com/v1'
const querystring = require('querystring')
const request = require('request')


async function publishPlaylist(req, res) {
  console.log("new publish playlist");
  const {token, movieName, soundtrack} = req.body;

  const headers = {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
  };

  try {
    const userId = await getUser(headers);
    const newPlaylistId = await createPlaylist(headers, movieName, userId);
    let songsIds = await Promise.all(
      soundtrack.map(songName => searchSong(headers, songName))
    )
    songsIds = songsIds.filter(x => x);

    let result =  await addSongToPlaylist(headers, newPlaylistId, songsIds)
    res.send("Playlist creada exitosamente");
    // getUser(headers, userId => {
    //   createPlaylist(headers, movieName, userId, newPlaylistId => {
    //     soundtrack.forEach(songName => {
    //       searchSong(headers, songName, songId => {
    //         addSongToPlaylist(headers, newPlaylistId, songId, (response) => {
    //           console.log(`song: ${songId} added to playlist: ${newPlaylistId}`);
    //         });
    //       });
    //     });
    //   });
    // });


  } catch(err) {
    console.log(err);
    return res.status(401).json({ error: err });
  }
}

function getUser(headers) {
  const userOptions = {
    url: `${spotify_url}/me`,
    headers
  }
  return new Promise((resolve, reject) => {
    request(userOptions, (error, response) => {
      if(error) {
        reject(error);
      };
      const userId = JSON.parse(response.body).id;
      resolve(userId);
    });
  });
}

function createPlaylist(headers, movieName, userId) {
    const options = {
      headers,
      json: {
        name: movieName
      }
    }
  return new Promise((resolve, reject) => {
    request.post(`${spotify_url}/users/${userId}/playlists`, options,
               (error, response) => {
                 if(error) {
                   reject(error);
                 }
                 const playlistId = response.body.id;
                 resolve(playlistId);
               });
  });
}

function searchSong(headers, songName) {
    const optionsSong = {
      headers,
      url: `${spotify_url}/search?` +
        querystring.stringify({
          q: songName,
          type: 'track',
          limit: 1
        }),
    }
  return new Promise((resolve, reject) => {
    request(optionsSong,
           (error, response) => {
             if(error) {
               reject(error);
             }
             const body = JSON.parse(response.body);
             if(!body.tracks.items || body.tracks.items.length == 0) {
               return resolve(null);
             }
             const songId = body.tracks.items[0].id;
             resolve(songId);
           });
  });
}

function addSongToPlaylist(headers, playlistId, songsIds) {
  const arrayUris = songsIds.map(songId => "spotify:track:" + songId)
    const options = {
      headers,
      json: {
        uris: arrayUris
      }
    }
  return new Promise((resolve, reject) => {
      request.post(`${spotify_url}/playlists/${playlistId}/tracks`, options,
                  (error, response) => {
                    if (error) {
                      reject(reject);
                    }
                    resolve(response.body);
                  });
  });
}


module.exports = {
  publishPlaylist
}
