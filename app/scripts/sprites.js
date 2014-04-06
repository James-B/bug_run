Q.Sprite.extend("Jump", {  
  init: function(p) {
    this._super(p,{
      sheet: p.sprite,
      type: Q.SPRITE_PLATFORM,
      collisionMask: Q.SPRITE_PLAYER,
      gravity: 0
    });
    this.add("2d");
    this.on("bump.top",this,"bounce");
  },

  bounce: function(col) {
    if(col.obj.isA("Player")) {
     col.obj.p.vy = -600;
     Q.AudioManager.playSound("jump.mp3");
    }
  }


});

Q.Sprite.extend("Tip", {  
  init: function(p) {
    this._super(p,{
      sheet: p.sprite,
      type: Q.SPRITE_INFO,
      collisionMask: Q.SPRITE_PLAYER,
      sensor: true
    });
    this.add("animation");
    this.on("sensor");
  },

  sensor: function(colObj) {
    console.log(this.p.msg);
    Q.stageScene("info", 2, {"msg":this.p.msg});
    this.destroy();
  }
});

Q.Sprite.extend("Collectable", {
  init: function(p) {
    this._super(p,{
      sheet: p.sprite,
      type: Q.SPRITE_COLLECTABLE,
      collisionMask: Q.SPRITE_PLAYER,
      sensor: true,
      vx: 0,
      vy: 0,
      gravity: 0
    });
    this.add("animation");

    this.on("sensor");
  },

  sensor: function(colObj) {
    if (this.p.amount) {
      Q.state.inc("score", this.p.amount);
    }
    this.destroy();
  }
});

Q.Collectable.extend("Apple", {
  sensor: function(colObj) {
    this._super();
    Q.state.inc("apples", 1);
    Q.AudioManager.playSound("apple.mp3");
    this.destroy();
  }
});

Q.Collectable.extend("GoldGem", {
  sensor: function(colObj) {
    this._super();
    Q.state.inc("goldGems", 1);
    Q.AudioManager.playSound("coin.mp3");
    this.destroy();
  }
});

Q.Sprite.extend("Platform", {
  init: function(p,defaults) {
    this._super(p,Q._defaults(defaults||{}, {
      sheet: p.sprite,
      vx: p.vx ? p.vx : 75,
      vy: p.vy ? p.vy : 0,
      direction: p.direction ? p.direction : 'left',
      gravity: 0,
      type: Q.SPRITE_PLATFORM,
      collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_PLATFORM
    }));
    this.p.speedx = this.p.vx;
    this.p.speedy = this.p.vy;

    this.add("2d, aiBounce, animation");
    if (this.p.vy > 0) {
      this.on("bump.top",this,"goDown");
      this.on("bump.bottom",this,"goUp");
    }
  },

  goDown: function(col) {
    if(!col || !col.obj.isA("Player")) {
      this.p.direction = 'down';
      this.p.vy = this.p.speedy;
    } else { 
      if (this.p.direction === "down") {
        col.obj.p.vy = this.p.speedy;
        this.p.vy = this.p.speedy;
      } else {
        col.obj.p.vy = -this.p.speedy;
        this.p.vy = -this.p.speedy;        
      }
    }
  },

  goUp: function(col) {
    this.p.direction = 'up';
    this.p.vy = -this.p.speedy;
  }
});

Q.Sprite.extend("Enemy", {
  init: function(p,defaults) {

    this._super(p,Q._defaults(defaults||{},{
      sheet: p.sprite,
      vx: p.vx ? p.vx : 75,
      defaultDirection: 'left',
      type: Q.SPRITE_ENEMY,
      collisionMask: Q.SPRITE_DEFAULT
    }));

    this.add("2d, aiBounce, animation");
    this.on("bump.top",this,"die");
    this.on("bump.left,bump.right,bump.bottom", "hit");

 //   this.on("hit.sprite",this,"hit");
  },

  step: function(dt) {
    if(this.p.dead) {
      this.del('2d, aiBounce');
      this.p.deadTimer++;
      if (this.p.deadTimer > 24) {
        // Dead for 24 frames, remove it.
        this.destroy();
      }
      return;
    }
    var p = this.p;

    p.vx += p.ax * dt;
    p.vy += p.ay * dt;

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    this.play('walk');
  },

  hit: function(col) {

    if(col.obj.isA("Player") && !col.obj.p.immune && !this.p.dead) {
      Q.Game.stageEndGameScreen();
    }
  },

  die: function(col) {
    if(col.obj.isA("Player")) {
 //     Q.audio.play('coin.mp3');
      this.p.vx=this.p.vy=0;
 //     this.play('dead');
      this.p.dead = true;
      var that = this;
      col.obj.p.vy = -300;
      this.p.deadTimer = 0;
    }
  }
});

Q.Enemy.extend("Snail", {
  init: function(p) {
    this._super(p,{
      w: 55,
      h: 36
    });
  },

  die: function(col) {
    this._super(col);
    if(col.obj.isA("Player")) {
      Q.state.inc("snails", 1);
      if (this.p.amount) {
        Q.state.inc("score", this.p.amount);
        Q.AudioManager.playSound("coin.mp3");
      }
    }
  }

});

Q.Collectable.extend("RedGem", {
  sensor: function(colObj) {
    if(colObj.isA("Player")) {
      colObj.p.immune = true;
      colObj.p.immuneTimer = 0;
    }
    this.destroy();
  }
});

Q.Sprite.extend("Player",{

  init: function(p) { 
    this._super(p, {
      sheet: "player",  // Setting a sprite sheet sets sprite width and height
      sprite: "player",
      direction: "right",
      falling: false,
      standingPoints: [ [ -16, 44], [ -23, 35 ], [-23,-48], [23,-48], [23, 35 ], [ 16, 44 ]],
      duckingPoints : [ [ -16, 44], [ -23, 35 ], [-23,-10], [23,-10], [23, 35 ], [ 16, 44 ]],
      jumpSpeed: -400,
      speed: 300,
      strength: 100,
      type: Q.SPRITE_PLAYER,
      collisionMask: Q.SPRITE_DEFAULT | Q.SPRITE_DOOR | Q.SPRITE_COLLECTABLE | Q.SPRITE_PLATFORM | Q.SPRITE_INFO
    });

    Q.input.on("esc",this,"showMenu");
    this.p.points = this.p.standingPoints;
    this.add('2d, platformerControls, animation, tween');        
    this.on("sensor.tile","checkSensor");
    this.on("bump.bottom", this, "collision");
    this.on("bump.top",this,"hitHead");
    this.on("jump", "playerJump");
  },

  showMenu: function() {
    Q.stage(0).pause(); 
    Q.stageScene("pauseMenu", 2);
  },

  playerJump: function(player) {
    if (player.p.onPlatform) {
      if (player.p.onPlatform && player.p.platform.p.direction === "up") {
        player.p.y -= 70;
      }
    }
  },

  hitHead: function(col){
    if(this.p.onPlatform) {
      this.p.platform.goDown(col);
    }
  },

  collision: function(col) {
    if (col.obj.isA("Platform")) {
      this.p.onPlatform = true;
      this.p.platform = col.obj;
      this.p.platformvx = col.obj.p.vx;
      this.p.platformvy = col.obj.p.vy;
      this.p.platformtype = col.obj.p.platformtype;
    }
  },

  checkSensor: function(colObj) {
    if(colObj.p.ladder) { 
      this.p.onLadder = true;
      this.p.ladderX = colObj.p.x;
    } else if (colObj.p.exit) {
      if (Q.state.get('apples') == 6) {
        if (Q.state.get("currentLevel") >= Q.Game.availableLevel) {
          Q.Game.availableLevel = Q.state.get("currentLevel") + 1;
          localStorage.setItem(Q.Game.storageKeys.availableLevel, Q.Game.availableLevel);        
        }
        this.destroy();
        Q.Game.stageLevelSummaryScreen();
      } else {
        this.destroy();
        Q.Game.stageEndGameScreen();
      }
    }
  },

  resetLevel: function() {
    Q.Game.stageLevel(Q.state.get("currentLevel"));
  },

  continueOverSensor: function() {
    this.p.vy = 0;
    if(this.p.vx != 0) {
      this.play("walk_" + this.p.direction);
    } else {
      this.play("stand_" + this.p.direction);
    }
  },

  step: function(dt) {
    var processed = false;

    if (this.p.immune) {
      if ((this.p.immuneTimer % 25) == 0) {
        var opacity = (this.p.immuneOpacity == 1 ? 0 : 1);
        this.animate({ opacity: opacity}, 0);
        this.p.immuneOpacity = opacity;
      }
      this.p.immuneTimer++;

      if (this.p.immuneTimer > 500) {
        this.p.immune = false;
        this.animate({"opacity": 1}, 1);
      }

    }

    if(this.p.onPlatform) {      
      var x = this.p.platformvx * dt,
          y = this.p.platformvy * dt,
          type = this.p.platformtype,
          obj = Q.stage().locate(this.p.x, this.p.y + this.p.cy);

      if (obj ===  false || !obj.className === "Platform") {
        this.p.onPlatform = false; 
      }
      if (type === "h") {
        this.p.x = this.p.x + x
        this.p.y = this.p.y + y;       
      } else {
      }
    }

    if(this.p.onLadder) {
      this.p.gravity = 0;

      if(Q.inputs['up']) {
        this.p.vy = -this.p.speed;
        this.p.x = this.p.ladderX;
        this.play("climb");
      } else if(Q.inputs['down']) {
        this.p.vy = this.p.speed;
        this.p.x = this.p.ladderX;
        this.play("climb");
      } else {
        this.continueOverSensor();
      }
      processed = true;
    } 

    if(!processed) { 
      this.p.gravity = 1;
    
      if(this.p.vx > 0) {
        this.play("walk_right");
        this.p.direction = "right";
      } else if(this.p.vx < 0) {
        this.play("walk_left");
        this.p.direction = "left";
      } else {
        this.play("stand_" + this.p.direction);
      }
           
    }
    
    this.p.onLadder = false;

    if(this.p.y > this.p.height * 70) {
      if (this.p.falling === false) {
        Q.AudioManager.playSound("o-o.mp3");
        this.p.falling = true;
      }
      this.stage.unfollow();
    }

    if(this.p.y > (this.p.height + 10) * 70 ) {
      Q.clearStages();
      this.resetLevel();
    }

  }

});