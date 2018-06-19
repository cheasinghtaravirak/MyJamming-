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
            ID: track.id,
            Name: track.name,
            Artist: track.artists[0].name,
            Album: track.album.name,
            URL: track.uri
          }));
        }
      });
    }
    /*savePlaylist(playlistName, trackURLs) {
      if(!playlistName && trackURLs) {
        return;
      } else {
        const accessToken = this.getAccessToken();
        const headers = {headers: {'Authorization': `Bearer ${accessToken}`}};
        let userID = '';
        return fetch();
      }
    } */ 

};




export default Spotify;
