'use strict';

juke.factory('PlayerFactory', function(){
  // non-UI logic in here
  var audio = document.createElement('audio');
  var currentSong = null;
  var isPlaying = false;
  var songList;
  var progress = 0;

  audio.addEventListener('timeupdate', function () {
    progress = audio.currentTime / audio.duration;
  })



  return {
  	start: function(song, arr) {

  		songList=arr;
  		if (currentSong != song) {
  			this.pause();
  		}


  		audio.src = song.audioUrl;

  		audio.load();
  		audio.play();
  		currentSong = song;
  		isPlaying = true

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

      currentSong = this.getCurrentSong()
      for (var i = 0; i < songList.length; i++) {
        if(currentSong.audioUrl==songList[i].audioUrl){
          
          if(i==songList.length-1){
            this.start(songList[0], songList)
          } else{
            var nextSong = songList[i+1];
            this.start(nextSong, songList) 
          }

          break;
        }
      }
  	},
  	previous: function(){

      currentSong = this.getCurrentSong()
      for (var i = 0; i < songList.length; i++) {
        if(currentSong.audioUrl==songList[i].audioUrl){
          
          if(i==0){
            this.start(songList[songList.length-1], songList)
          } else{
            var previousSong = songList[i-1];
            this.start(previousSong, songList) 
          }

          break;
        }
      }
    },
  	getProgress: function(){
      return progress;
    }

  };
});




