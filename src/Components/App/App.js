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
      playListName: '', //title
      playListTracks: [] //array of objs contains name, artist, album, & id properties
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlayListName = this.updatePlayListName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      this.setState({playListTracks: [this.state.playListTracks, track]});
    }
  }
  removeTrack(track) {
    const removedTracks = this.state.playListTracks.filter(savedTrack => savedTrack !== track);
    this.setState({playListTracks: removedTracks});
  }
  updatePlayListName(name) {
    this.setState({playListName: name});
  }
  savePlaylist() {
    const trackURIs = this.state.playListTracks.map(track => track.uri);
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
            <Playlist playListName = {this.state.playListName} playListTracks = {this.state.playListTracks}
            onRemove = {this.removeTrack} onNameChange = {this.updatePlayListName}
            onSave = {this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
