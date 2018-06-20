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
        return fetch('https://api.spotify.com/v1/me', {
          headers: headers
        }).then(response => response.json()).then(jsonResponse => {
          userID = jsonResponse.id;
        }).then(() => {
          return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({name: playlistName})
          }).then(response =>
          response.json()).then(jsonResponse => playlistID = jsonResponse.id)
        }).then(() => {
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
export default Spotify;
