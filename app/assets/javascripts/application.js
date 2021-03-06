// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require fancybox
//= require bootstrap
//= require_tree .

// Hide header on scroll down, show on scroll up
var didScroll;
var lastScrollTop = 0;
var delta = 40;
var navbarHeight = $('header').outerHeight();

$(window).scroll(function(event){
  didScroll = true;
});

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  var st = $(this).scrollTop();

  // Make sure they scroll more than delta
  if(Math.abs(lastScrollTop - st) <= delta)
    return;

  // If y-scroll is greater than the navbar height, add class .nav-up.
  // This is necessary so you never see what is "behind" the navbar.
  if (st > lastScrollTop && st > navbarHeight){
    // Scroll Down
    $('header').removeClass('nav-down').addClass('nav-up');
  } else {
    // Scroll Up
    if(st + $(window).height() < $(document).height()) {
      $('header').removeClass('nav-up').addClass('nav-down');
    }
  }

  lastScrollTop = st;
}

//song player functions

songArray = []
currentlyPlaying = 0;
//widget = SC.Widget("sc-widget");

var songIdFromIndex = function(index) {
  var songClass = "#song-"+index
  console.log(songClass)
  return songClass
}

var resumePlayer = function() {
  $(".playing").removeClass("glyphicon-play").addClass("glyphicon-pause");
  $("#custom-player-pp").removeClass("glyphicon-play").addClass("glyphicon-pause")
  widget.play()
  console.log("resume player")
}

var pausePlayer = function() {
  $(".playing").removeClass("glyphicon-pause").addClass("glyphicon-play");
  $("#custom-player-pp").removeClass("glyphicon-pause").addClass("glyphicon-play");
  widget.pause()
  console.log("pause player")
}

var stopPlayer = function() {
  $(".currently-playing").removeClass("currently-playing")
  $(".playing").removeClass("glyphicon-pause playing").addClass("glyphicon-play");
  console.log("stop player")
}

var startPlayerWithIndex = function(index) {
  widget.load( songArray[currentlyPlaying] , { auto_play: true });
  songObj = $(songIdFromIndex(index));
  songObj.removeClass("glyphicon-play").addClass("glyphicon-pause playing");
  //add extra class to submission div that adds background color
  songObj.parent().addClass("currently-playing");
  //write selected song name to banner of custom player
  var songName = songObj.parent().parent().parent().find(".song-name").text();
  $(".player-meta").text(songName);
  $("#custom-player-pp").removeClass("glyphicon-play").addClass("glyphicon-pause playing")
  console.log("start player")
}

var mapPlayOnClick = function() {
  if ( $(this).hasClass("playing glyphicon-play")) {
    resumePlayer();
  } else if ( $(this).hasClass("glyphicon-pause") ) {
    pausePlayer();
  } else {
    currentlyPlaying = $(this).attr('id').split('-')[1]
    console.log( currentlyPlaying );
    stopPlayer();
    startPlayerWithIndex(currentlyPlaying);
  }
}

var bindToSubmissions = function() {
  $(".bind-map").each(function() {
    $(this).removeClass("bind-map");
    songArray.push($(this).attr('id'))
    $(this).attr('id', 'song-'+ (songArray.length - 1))
    $(this).on("click", mapPlayOnClick)
  })
}

var advanceToNext = function() {
  if(currentlyPlaying < (songArray.length - 1)) {
    console.log(currentlyPlaying)
    stopPlayer();
    startPlayerWithIndex(++currentlyPlaying);
  } else if (!arguments[0]) {
    stopPlayer();
  } else {
    console.log("user tried to skip at end of list")
  }
}

var ready = function() {

  $("a.fancybox").fancybox({
    'padding'	: 0
  });

  $("a.fancybox").fancybox({
    tpl: {
      closeBtn: '<a title="Close" class="fancybox-item fancybox-close myClose glyphicon glyphicon-remove" href="javascript:;" style="background-image:none;"></a>'
    },
    'padding'	: 0
  });

  //Bootstrap hover popup for submission poster
  $("[data-toggle='tooltip']").tooltip();
  

  bindToSubmissions();
  widget = SC.Widget("sc-widget");

  //attaching listener to custom player - play/pause
  $("#custom-player-pp").on("click", function(){
    if ( $(this).hasClass("glyphicon-play")) {
      resumePlayer();
    } else if ( $(this).hasClass("glyphicon-pause") ) {
      pausePlayer();
    }
  });

  //attaching listener to custom player - next
  $("#custom-player-next").on("click", function(){
    console.log("next song")
    advanceToNext(true);
  })

  //attaching listener to custom player - previous
  $("#custom-player-prev").on("click", function(){
    console.log("prev song");
    if(currentlyPlaying > 0) {
      stopPlayer();
      startPlayerWithIndex(--currentlyPlaying);
    } else {
      console.log("user tried to go to previous song at beginning of list")
    }
  })

  //setup automatic play next track
  //widget.bind(SC.Widget.Events.FINISH, advanceToNext(false));

  //notify song completion
  widget.bind(SC.Widget.Events.FINISH, function() {
    //$.post("./increment/1");
    var submission = $(songIdFromIndex(currentlyPlaying)).parent().parent().parent().attr('id').split('-')[1]
    console.log(submission);
    $.post("./increment/"+submission);
    advanceToNext(false);
    console.log("notified play finished");
  })

  //Fade out alert
  window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function(){
      $(this).remove();
    });
  }, 2000);
};

$(document).ready(ready);
$(document).on('page:load', ready);
