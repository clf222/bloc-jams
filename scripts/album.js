var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
  
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
//            currentlyPlayingSongNumber = songNumber;
//            currentSongFromAlbum = currentAlbum.songs[songNumber-1];
            updatePlayerBarSong();
      } else if  (currentlyPlayingSongNumber === songNumber) {
         $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentlyPlayingSongNumber = null;
          currentSongFromAlbum = null;
          
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
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentIndex++;
    //window.alert(currentIndex);
    if (currentIndex >= currentAlbum.songs.length) {
        currentIndex = 0;
    }  
    
  //window.alert("next index is "+ currentIndex);
    var lastSongNumber = currentlyPlayingSongNumber;
  //  setSong(lastSongNumber+1); /*not sure here */
    currentlyPlayingSongNumber = currentIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentIndex];
    updatePlayerBarSong();
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
    //setSong(currentSongIndex +1);
    currentlyPlayingSongNumber = currentSongIndex + 1;	   
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    updatePlayerBarSong();

    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};
var updatePlayerBarSong = function() {
   //updates the text of the <h2> tags that contain the song name and the artist name. Reference data from the current song variables to populate them 
   
   $('.currently-playing .song-name').text(currentSongFromAlbum.title);
   $('.currently-playing .artist-name').text(currentAlbum.artist);
   $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum + " - " + currentAlbum.artist);
   $('.main-controls .play-pause').html(playerBarPauseButton);
    
};

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

var setSong = function(songNumber) {
   //assigns currentlyPlayingSongNumber and currentSongFromAlbum a new value based on the new song number. 
   
    currentlyPlayingSongNumber = parseInt(songNumber) ;
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
};

var getSongNumberCell = function(number){
 return    $('.song-item-number[data-song-number="' + number + '"]');
};

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
   
});
    
    
    
    
     

  

    
     

            
    
 


