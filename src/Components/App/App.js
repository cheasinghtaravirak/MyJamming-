import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [], //array of objs contains name, artist, album
      playlistName: '', //title
      playlistTracks: [] //array of objs contains name, artist, album, & id properties
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {

      //this.setState({playlistTracks: [this.state.playlistTracks, track]}); (working but show only for one)
      //this.setState({playlistTracks: this.state.playlistTracks.push(track)}); (not working)
      this.setState({ playlistTracks: this.state.playlistTracks.concat(track) }); //working !!!
      //New problem: how to see the saved music in my Spotify playlist?
    }
  }
  removeTrack(track) {
    const removedTracks = this.state.playlistTracks.filter(savedTrack => savedTrack !== track);
    this.setState({playlistTracks: removedTracks});
  }
  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }
  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(response => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    })
  }
  search(term) {
    Spotify.search(term).then(tracks => {
      this.setState({searchResults: tracks});
    });
    }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar onSearch = {this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack}/>
            <Playlist playlistName = {this.state.playlistName} playlistTracks = {this.state.playlistTracks}
            onRemove = {this.removeTrack} onNameChange = {this.updatePlaylistName}
            onSave = {this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
