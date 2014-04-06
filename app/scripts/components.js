Q.UI.HelpButton = Q.UI.Button.extend("UI.HelpButton", {
  init: function(p) {
    var _this = this;
    this._super(p, {
      x: 0,
      y: 0,
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
      sheet: "ui_help_on"
    });
    return this.on('click', function() {
      Q.Game.stageHelpScreen();
    });
  }
}); 

Q.UI.ShareButton = Q.UI.Button.extend("UI.ShareButton", {
  init: function(p) {
    var _this = this;
    this._super(p, {
      x: 0,
      y: 0,
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
      sheet: "ui_share_on"
    });
    return this.on('click', function() {
      FB.ui({method: 'apprequests',
        title: 'Bug Run',
        message: 'Play Byg Run based on the new book by Meredith Blinkhorn!',
      });
    });
  }
}); 

Q.UI.FBButton = Q.UI.Button.extend("UI.FBButton", {
  init: function(p) {
    var _this = this;
    this._super(p, {
      x: 0,
      y: 0,
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
      sheet: "ui_fb_connect",
      keyActionName: "login"
    });

    if (Q.Game.User.loggedIn) {
      this.p.sheet = "ui_fb_logout";
    } else {
      this.p.sheet = "ui_fb_connect";
    }

    return this.on('click', function() {
      console.log(Q.Game.User.loggedIn);
    if (Q.Game.User.loggedIn) {
  //    _this.p.sheet = "ui_fb_logout";
      Q.Game.User.disconnect();
    } else {
   //   _this.p.sheet = "ui_fb_connect";
      Q.Game.User.connect();
    }
    });
  },

  loggedOut: function() {
    this.p.sheet = "ui_fb_connect";
  },

  loggedIn: function() {
    this.p.sheet = "ui_fb_logout";
  }

}); 

Q.UI.AudioButton = Q.UI.Button.extend("UI.AudioButton", {
  init: function(p) {
    var _this = this;
    this._super(p, {
      x: 0,
      y: 0,
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
      sheet: "ui_audio_on",
      keyActionName: "audioMute"
    });
    if (Q.AudioManager.audioMuted) {
      this.p.sheet = "ui_audio_off";
    } else {
      this.p.sheet = "ui_audio_on";
    }
    return this.on('click', function() {
      if (!Q.AudioManager.audioMuted) {
        Q.AudioManager.audioMute();
        _this.p.sheet = "ui_audio_off";
      } else {
        Q.AudioManager.audioUnmute();
        _this.p.sheet = "ui_audio_on";
      }
    });
  }
}); 

Q.UI.MusicButton = Q.UI.Button.extend("UI.MusicButton", {
  init: function(p) {
    var _this = this;
    this._super(p, {
      x: 0,
      y: 0,
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
      sheet: "ui_music_on",
      keyActionName: "musicMute"
    });
    if (Q.AudioManager.musicMuted) {
      this.p.sheet = "ui_music_off";
    } else {
      this.p.sheet = "ui_music_on";
    }
    return this.on('click', function() {
      if (!Q.AudioManager.musicMuted) {
        Q.AudioManager.musicMute();
        _this.p.sheet = "ui_music_off";
      } else {
        Q.AudioManager.musicUnmute();
        _this.p.sheet = "ui_music_on";
      }
    });
  }
}); 

  Q.component('aiVBounce', {
    added: function() {
      this.entity.on("bump.Top",this,"goDown");
      this.entity.on("bump.Bottom",this,"goUp");
    },

    goDown: function(col) {
      this.entity.p.vy = -col.impact;      
      if(this.entity.p.defaultDirection === 'up') {
          this.entity.p.flip = 'y';
      }
      else {
          this.entity.p.flip = false;
      }
    },

    goUp: function(col) {
      this.entity.p.vy = col.impact;
      if(this.entity.p.defaultDirection === 'down') {
          this.entity.p.flip = 'y';
      }
      else {
          this.entity.p.flip = false;
      }
    }
  });

Q.UI.StarImg = Q.Sprite.extend("Q.UI.StarImg", {
  init: function(p) {
    return this._super(p, {
      sheet: "ui_star"
    });
  }
});

Q.UI.AppleImg = Q.Sprite.extend("Q.UI.AppleImg", {
  init: function(p) {
    return this._super(p, {
      x: 0,
      y: 40,
      sheet: "apple"
    });
  }
});

Q.UI.HUDApples = Q.UI.Text.extend("Apples",{ 
  init: function(p) {
    this._super({
      color: "black",
      label: "0 / 6",
      size: 40,
      x: 70,
      y: 55
    });
    Q.state.on("change.apples",this,"apples");
  },

  apples: function(apples) {
    this.p.label = apples + " / 6";
  }
});

Q.UI.HUDScore = Q.UI.Text.extend("Score",{ 
  init: function(p) {
    this._super({
      color: "black",
      label: "score: 0",
      size: 40,
      x: 400,
      y: 55
    });
    Q.state.on("change.score",this,"score");
  },

  score: function(score) {
    this.p.label = "score: " + score;
  }
});

Q.UI.LevelButton = Q.UI.Button.extend("UI.LevelButton", {
  init: function(p) {
    var _this = this;
    this._super(p, {
      type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
      sheet: "ui_level_button",
      fontColor: "#ffffff",
      font: "400 70px Finger Paint",
    });
    this.p.label = this.p.level;
    this.p.sheetW = 344;
    this.p.sheetH = 230;
    this.p.cx = this.p.sheetW / 2;
    this.p.cy = this.p.sheetH / 2;
    if (this.p.enabled === false) {
      this.p.sheet = "ui_level_button_locked";
      this.p.label = false;
    }
    return this.on('click', function() {
        if (_this.p.enabled) {
          if (_this.p.level >= 1) {
            Q.Game.stageLevel(_this.p.level);
//            return Game.stageLevel(_this.p.level);
          } else {
//            return Game.stageControlsScreen();
          }
        } else {
//          return Game.trackEvent("Level Button", "clicked", "locked");
        }
    });
  }

});