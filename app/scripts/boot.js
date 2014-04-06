/*
var canvas = document.getElementById('quintus'),
context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
*/
window.Q = Quintus({
  imagePath: "images/",
  audioPath: "audio/",
  dataPath: "data/",
  audioSupported: ['mp3','ogg']
})
.include("Sprites, Scenes, Input, 2D, Touch, UI, Anim, TMX, Audio")
Q.setup('quintus', {
  maximize: false,
  //upsampleWidth: 640,
 // upsampleHeight: 320,

  width:   1024,        // Set the default width to 800 pixels
  height:  672 ,        // Set the default height to 600 pixels

//  width:   1024,        // Set the default width to 800 pixels
//  height:  672 ,        // Set the default height to 600 pixels


//  upsampleWidth:  1024,  // Double the pixel density of the 
//  upsampleHeight:672  // game if the w or h is 420x320
                        // or smaller (useful for retina phones)
//  downsampleWidth: 2048, // Halve the pixel density if resolution
//  downsampleHeight: 1244  // is larger than or equal to 1024x768

});//.controls().touch()

Q.input.joypadControls();

Q.touch(Q.SPRITE_ALL);

Q.controls();
Q.debug = false;
Q.debugFill = false;
Q.enableSound();

Q.SPRITE_NONE = 0;
Q.SPRITE_PLAYER = 1;
Q.SPRITE_COLLECTABLE = 2;
Q.SPRITE_ENEMY = 4;
Q.SPRITE_PLATFORM = 8;
Q.SPRITE_BUMPER = 16;
Q.SPRITE_INFO = 32;
Q.SPRITE_UI  = 64;

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

/*

Q.SPRITE_DOOR = 0;
*/

Q.Game = {};

Q.Game.storageKeys = {
  availableLevel: "bugRun:availableLevel",
  isMusicMuted: "bugRun:isMusicMuted",
  isAudioMuted: "bugRun:isAudioMuted"
};

Q.Game.getStars = function(level) {
  var id = Q.Game.User.uid,
    key = "bugRun:" + id + ":level" + level,
    object = localStorage.getObject(key);

   if (object) {
     return object.stars;
   } else {
     return 0;
   }
};

Q.Game.getScore = function(level) {
  var id = Q.Game.User.uid,
    key = "bugRun:" + id + ":level" + level,
    object = localStorage.getObject(key);
    
   if (object) {
     return object.score;
   } else {
     return 0;
   }
};

Q.Game.saveScore = function (score, stars, level, id) {
  var key = "bugRun:" + id + ":level" + level,
    object = localStorage.getObject(key),
    newObject = { stars: stars, score: score}; 

  if (!object || score >= object.score) {
    localStorage.setObject(key, newObject);
  }
};

Q.AudioManager = {
  audioMuted: false,
  musicMuted: false,

  init: function() {
    var isAudioMuted = localStorage.getItem(Q.Game.storageKeys.isAudioMuted),
      isMusicMuted = localStorage.getItem(Q.Game.storageKeys.isMusicMuted);

    if (isAudioMuted === 'true') {
      this.audioMuted = true;
    }

    if (isMusicMuted === 'true') {
      this.musicMuted = true;
    }
  },

  playMusic: function(music) {
    if (!this.musicMuted) {
      Q.audio.play(music, { loop: true });
    }
  },
  
  playSound: function(sound) {
    if (!this.audioMuted) {
      Q.audio.play(sound, { loop: false });
    }
  },

  audioMute: function() {
    this.audioMuted = true;
    localStorage.setItem(Q.Game.storageKeys.isAudioMuted, true);
  },
  
  audioUnmute: function() {
    this.audioMuted = false;
    localStorage.setItem(Q.Game.storageKeys.isAudioMuted, false);
  },

  musicMute: function() {
    this.musicMuted = true;
    localStorage.setItem(Q.Game.storageKeys.isMusicMuted, true);
  },
  
  musicUnmute: function() {
    this.musicMuted = false;
    localStorage.setItem(Q.Game.storageKeys.isMusicMuted, false);
  }


};
Q.AudioManager.init();

Q.Game.stageEndGameScreen = function() {
  Q.audio.stop();
  Q.AudioManager.playSound("sad-trombone.mp3");
  Q.clearStages();
  Q.stageScene("endGame");
};

Q.Game.stageLevelSummaryScreen = function() {
  Q.audio.stop();
  Q.clearStages();
  Q.stageScene("levelSummary");
};

Q.Game.stageLevelSelectScreen = function() {
  Q.audio.stop();
  Q.clearStages();
  Q.stageScene("levelSelect");
};

Q.Game.stageHelpScreen = function() {
  Q.audio.stop();
  Q.clearStages();
  Q.stageScene("help");
};

Q.Game.stageLevel = function(level) {

  Q.state.reset({
    currentLevel: level,
    score: 0,
    apples: 0,
    goldGems: 0,
    numGoldGems: 0,
    snails: 0,
    numSnails: 0 
  });

  Q.clearStages();
  Q.stageScene("level" + level, 0);
  Q.stageScene('hud', 3, Q('Player').first().p);

  Q.state.set("numGoldGems", Q("GoldGem").length);
  Q.state.set("numSnails", Q("Snail").length);

  Q.AudioManager.playMusic("music.mp3");
};

Q.Game.availableLevel = localStorage.getItem(Q.Game.storageKeys.availableLevel) || 1;



