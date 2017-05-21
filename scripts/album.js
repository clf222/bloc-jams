var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
//#requirement 1 
var $mainControls = $('.main-controls .play-pause');
  
var createSongRow = function(songNumber, songName, songLength) {
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
          console.log(currentSoundFile);
           currentSoundFile.play();
            updatePlayerBarSong();
      } else if  (currentlyPlayingSongNumber === songNumber) {
         
       
          if(currentSoundFile.isPaused()){
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
             currentSoundFile.play();
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
   
    
};

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

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

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number){
 return    $('.song-item-number[data-song-number="' + number + '"]');
};
//#3 function
//If a song is paused and the play button is clicked in the player bar, it will
//Change the song number cell from a play button to a pause button
//Change the HTML of the player bar's play button to a pause button
//Play the song
//If the song is playing (so a current sound file exist), and the pause button is clicked
//Change the song number cell from a pause button to a play button
//Change the HTML of the player bar's pause button to a play button
//Pause the song

var togglePlayFromPlayerBar = function() {
    if ((currentSoundFile.isPaused()=== true) && $(this).hasClass('.ion-play')) {
        console.log('first if');
       $songNumberCell.html(pauseButtonTemplate);
       $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();      
    }
    if ((currentSoundFile.isPaused() === false) && $(this).hasClass('.ion-pause')) {
        console.log('second if');
       $songNumberCell.html(playButtonTemplate);
         $('.main-controls .play-pause').html(playerBarPauseButtonButton);
        currentSoundFile.pause();
        } 
};

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
    //#2 add click event
     $mainControls.click(togglePlayFromPlayerBar);
   
});
    
    
    
    
     

  

    
     

            
    
 


