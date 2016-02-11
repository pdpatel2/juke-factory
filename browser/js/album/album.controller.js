'use strict';

juke.controller('AlbumCtrl', function($scope, $http, $rootScope, $log, StatsFactory, PlayerFactory) {

  // load our initial data
  $http.get('/api/albums/')
  .then(res => $http.get('/api/albums/' + res.data[1]._id)) // temp: use first
  .then(res => res.data)
  .then(album => {
    album.imageUrl = '/api/albums/' + album._id + '.image';
    album.songs.forEach(function (song, i) {
      song.audioUrl = '/api/songs/' + song._id + '.audio';
      song.albumIndex = i;
    });
    $scope.album = album;
    return album;
  })
  .then(function(album) {
    StatsFactory.totalTime(album)
    .then(function (albumDuration) {
        $scope.fullDuration = albumDuration;
    });

  })
  .catch($log.error); // $log service can be turned on and off; also, pre-bound

  // $scope.filterDuration = function(duration) {
  //   var seconds = (duration % 60).toString().slice(0,2)
  //   var minutes;
  //   var hours;
  //   if((Math.round(duration / 60) < 60) minutes = Math.round(duration / 60);
  //   else {
  //     hours = Math.round((Math.round(duration / 60) / 60));
  //     minutes = (duration/60) % 60
  //   }
  //   //mm:ss
  // }
  $scope.playing = PlayerFactory.isPlaying;
  $scope.currentSong = PlayerFactory.getCurrentSong;
  // main toggle
  $scope.toggle = function (song) {
    
    if (PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()) {
      PlayerFactory.pause()
    }
    else {
      if(song === PlayerFactory.getCurrentSong()){
        PlayerFactory.resume()  
      }else{
        PlayerFactory.start(song);
      }
      
    }

      // $rootScope.$broadcast('pause');
    // } else $rootScope.$broadcast('play', song);
  };

  // incoming events (from Player, toggle, or skip)
  // $scope.$on('pause', pause);
  // $scope.$on('play', play);
  $scope.$on('next', next);
  $scope.$on('prev', prev);

  // functionality

  // PlayerFactory.pause()
  // function pause () {
  //   $scope.playing = false;
  // }
  // function play (event, song) {
  //   $scope.playing = true;
  //   $scope.currentSong = song;
  // };

  // a "true" modulo that wraps negative to the top of the range
  function mod (num, m) { return ((num % m) + m) % m; };

  // jump `interval` spots in album (negative to go back, default +1)
  function skip (interval) {
    if (!$scope.currentSong) return;
    var index = $scope.currentSong.albumIndex;
    index = mod( (index + (interval || 1)), $scope.album.songs.length );
    $scope.currentSong = $scope.album.songs[index];
    if ($scope.playing) $rootScope.$broadcast('play', $scope.currentSong);
  };
  function next () { skip(1); };
  function prev () { skip(-1); };

});

juke.factory('StatsFactory', function ($q) {
    var statsObj = {};
    statsObj.totalTime = function (album) {
        var audio = document.createElement('audio');
        return $q(function (resolve, reject) {
            var sum = 0;
            var n = 0;
            function resolveOrRecur () {
                if (n >= album.songs.length) resolve(sum);
                else audio.src = album.songs[n++].audioUrl;
            }
            audio.addEventListener('loadedmetadata', function () {
                sum += audio.duration;
                resolveOrRecur();
            });
            resolveOrRecur();
        });
    };
    return statsObj;
});

