const clientID = '2d3d2d26799d470f8a7e431468cab41b';
const redirectURL = 'http://localhost:3000/';
let accessToken;
const Spotify = {
  getAccessToken() {
    if(accessToken) {
      return accessToken;
    } else {
      const access_token = window.location.href.match(/access_token=([^&]*)/);
      const expire_in = window.location.href.match(/expires_in=([^&]*)/);
      if(access_token && expire_in) {
        accessToken = access_token[1];
        const expiresIn = expire_in[1];
        window.setTimeout(() => accessToken = '', expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
      } else {
          window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
      }
      return accessToken;
    }
  },
  search(term) {
      const accessToken = this.getAccessToken();
      return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
      {headers: {'Authorization': `Bearer ${accessToken}`}}).then(response => response.json())
      .then(jsonResponse => {
        if(!jsonResponse.tracks) {
          return [];
        } else {
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
          }));
        }
      });
    },
    savePlaylist(playlistName, trackURIs) {
      if(!playlistName && trackURIs) {
        return;
      } else {
        const accessToken = this.getAccessToken();
        const headers = {'Authorization': `Bearer ${accessToken}`};
        let userID = '';
        let playlistID = '';
        //Get current user's ID
        return fetch('https://api.spotify.com/v1/me', {
          headers: headers
        }).then(response => response.json()).then(jsonResponse => {
          userID = jsonResponse.id;
        }) //Post a new playlist with the input name. Receive the playlist ID back from the request
        .then(() => {
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({name: playlistName})
          }).then(response =>
          response.json()).then(jsonResponse => playlistID = jsonResponse.id)
        }) //Post the track URIs to the newly-created playlist. Referencing the current user's account (ID)
        // and the new playlist (ID) (problem lies here!!!)
        .then(() => {
          return fetch(`//api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({uris: trackURIs})
          }).then(response => response.json()).then(jsonResponse => playlistID = jsonResponse.id)
        });
      }
    }

};
//http://api.spotify.com/v1/users/k15v8l0pa3v0j75nk75pk24mh/playlists/2BOQkN3pWrDDLIArNLSY4Z/tracks
//My spotify id: k15v8l0pa3v0j75nk75pk24mh
//playlistID: 2BOQkN3pWrDDLIArNLSY4Z
export default Spotify;
