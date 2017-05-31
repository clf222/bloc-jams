var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var createSongRow = function(songNumber, songName, songLength) {
   
  songLength = filterTimeCode(songLength);
  var template =
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="'  + songNumber + '">'+ songNumber + '</td>'
  + '  <td class="song-item-title">'  + songName   + '</td>'
  + '  <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>';
    var $row = $(template);
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};
  var clickHandler =function() {

      var songNumber = parseInt($(this).attr('data-song-number'));

      if (currentlyPlayingSongNumber !== null) {
          var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
          currentlyPlayingCell.html(currentlyPlayingSongNumber);

      }
      if (currentlyPlayingSongNumber !== songNumber) {
           $(this).html(pauseButtonTemplate);
            setSong(songNumber);
          //play current sound file
          // currentSoundFile = currentSongFromAlbum.audioUrl;

          currentSoundFile.play();
          updatePlayerBarSong();
          updateSeekBarWhileSongPlays();
          var $volumeFill = $('.volume .fill');
          var $volumeThumb = $('.volume .thumb');
          $volumeFill.width(currentVolume + '%');
          $volumeThumb.css({left: currentVolume + '%'});
      } else if
          (currentlyPlayingSongNumber === songNumber) {
          if(currentSoundFile.isPaused()){
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
             currentSoundFile.play();
             updateSeekBarWhileSongPlays();

             }
          else {
             $(this).html(playButtonTemplate);
             $('.main-controls .play-pause').html(playerBarPlayButton);
             currentSoundFile.pause();
          }


      }
  };



  var onHover = function(event) {
      var $songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt($songNumberCell.attr('data-song-number'));
          if (parseInt(($songNumberCell).attr('data-song-number')) !== currentlyPlayingSongNumber) {
              $songNumberCell.html(playButtonTemplate) ;
          }
  };

  var offHover = function(event) {
        var $songNumberCell = $(this).find('.song-item-number');
        var songNumber =parseInt($songNumberCell.attr('data-song-number'));
         if (parseInt(($songNumberCell).attr('data-song-number')) !== currentlyPlayingSongNumber) {
              $songNumberCell.html(songNumber) ;
          }


  };


var setCurrentAlbum = function(album) {

  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

//2
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

//3
  //albumSongList.innerHTML = '';
  $albumSongList.empty();

//4
  for (var i = 0; i<album.songs.length ; i++) {
    //albumSongList.innerHTML += createSongRow(i+1, album.songs[i].title, album.songs[i].duration);
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }

};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(this.getTime());
        });
    }
};


var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    var percentageString = offsetXPercent + "%";
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
    $seekBars.click(function(event) {
        var offSetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offSetX / barWidth;
          if ($(this).parent().attr('class') == 'seek-control' ) {
                seek(seekBarFillRatio*currentSoundFile.getDuration());
            } else  {
                //seekbar clicked volume
                setVolume(seekBarFillRatio*100);
            }
        updateSeekPercentage($(this), seekBarFillRatio);
    });
    $seekBars.find('.thumb').mousedown(function(event) {
        var $seekBar = $(this).parent();
        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr('class') == 'seek-control' ) {
                seek(seekBarFillRatio*currentSoundFile.getDuration());
            } else  {
                //seekbar clicked volume
                setVolume(seekBarFillRatio*100);
            }


            updateSeekPercentage($seekBar, seekBarFillRatio);
        });

        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });


};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};
var nextSong = function(album,song){
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    //window.alert(currentIndex);
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }


    var lastSongNumber = currentlyPlayingSongNumber;

    //currentlyPlayingSongNumber = currentIndex + 1;
    //currentSongFromAlbum = currentAlbum.songs[currentIndex];
    setSong(currentSongIndex + 1);
    updatePlayerBarSong();
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);

    //window.alert($nextSongNumberCell);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);



};
var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    //window.alert(currentSongIndex);
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length -1;
        }
     // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex +1);
    //currentlyPlayingSongNumber = currentSongIndex + 1;
  //  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

    updatePlayerBarSong();
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);

};
var updatePlayerBarSong = function() {
   //updates the text of the <h2> tags that contain the song name and the artist name. Reference data from the current song variables to populate them

   $('.currently-playing .song-name').text(currentSongFromAlbum.title);
   $('.currently-playing .artist-name').text(currentAlbum.artist);
   $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
   $('.main-controls .play-pause').html(playerBarPauseButton);
   setTotalTimeInPlayerBar(currentSongFromAlbum.duration);


};

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $mainControls = $('.main-controls .play-pause');

var setSong = function(songNumber) {
   //assigns currentlyPlayingSongNumber and currentSongFromAlbum a new value based on the new song number.
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber) ;
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });

    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};
var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number){
 return    $('.song-item-number[data-song-number="' + number + '"]');
};

var togglePlayFromPlayerBar = function() {
    if (currentSoundFile.isPaused()) {
        console.log('first if');
       var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
       $songNumberCell.html(pauseButtonTemplate);
       $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
    } else if (!currentSoundFile.isPaused()) {
        console.log('second if');
        var $songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
        $songNumberCell.html(playButtonTemplate);
         $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
}

var setCurrentTimeInPlayerBar = function(currentTime) {
    //sets the text of the element with the .current-time class to the current time in the song.
    // add to updateSeekBarWhileSongPlays() so currentTime updates with songplayback
     var time = filterTimeCode(currentTime);
    $('.current-time').text(time);
};

var setTotalTimeInPlayerBar = function(totalTime) {
    //sets the text of the element with the .total-time class to the length of the song.
    //add to updatePlayerBarSong so total time is set when a song first plays
    var time = filterTimeCode(totalTime);
    $('.total-time').text(time);
    
};

var filterTimeCode = function(timeInSeconds) {
    var time =parseFloat(timeInSeconds);
    var minutes = Math.floor(time/60);
    var seconds = Math.round(time - minutes*60);
    if (seconds < 10) {
        seconds = "0"+seconds;
    }
    return minutes + ":" +seconds;    
};

//4. Wrap the arguments passed to setCurrentTimeInPlayerBar() and setTotalTimeInPlayerBar() in a filterTimeCode() call so the time output below the seek bar is formatted.
//5. Wrap the songLength variable in createSongRow() in a filterTimeCode() call so the time lengths are formatted

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $mainControls.click(togglePlayFromPlayerBar);
     setupSeekBars();

});
