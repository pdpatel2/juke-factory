'use strict';

juke.factory('PlayerFactory', function(){
  // non-UI logic in here
  var audio = document.createElement('audio');
  var currentSong = null;
  var isPlaying = false;
  var songList;
  return {
  	start: function(song, arr) {
  		// arr = songList
  		// console.log("THIS IS SONG LIST: ", arr)
  		
  		if (currentSong != song) {
  			this.pause();
  		}
  		audio.src = song.audioUrl;
  		audio.load();
  		audio.play();
  		currentSong = song;
  		isPlaying = true
  		// songList.push(song)
  	},

  	pause: function() {
  		audio.pause();
  		isPlaying = false;
  	},

  	resume: function() {
  		audio.play()
  		isPlaying = true
  	},

  	isPlaying: function() {
  		return isPlaying
  	},

  	getCurrentSong: function() {
  		return currentSong;
  	},

  	next: function() {

  	}
  	// previous:
  	// getProgress:

  };
});