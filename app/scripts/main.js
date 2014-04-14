
Q.load("level1.tmx, level2.tmx, level3.tmx, level4.tmx, level5.tmx, level6.tmx, ui.json, tiles.json, platforms.json, enemies.json, collectables.json, buttons.json, player.json, platforms.png, enemies.png, collectables.png, tiles.png, player.png, ui.png, buttons.png, o-o.mp3, apple.mp3, jump.mp3, sad-trombone.mp3, music.mp3, coin.mp3", function() {
    Q.compileSheets("player.png","player.json");
    Q.compileSheets("ui.png","ui.json");
    Q.compileSheets("collectables.png","collectables.json");
    Q.compileSheets("enemies.png","enemies.json");
    Q.compileSheets("tiles.png","tiles.json");
    Q.compileSheets("platforms.png","platforms.json");
    Q.compileSheets("buttons.png","buttons.json");
//      walk_right: { frames: [0,1,2,3,4,5,6,7,8,9,10], rate: 1/15, flip: false, loop: true },
//      walk_left: { frames:  [0,1,2,3,4,5,6,7,8,9,10], rate: 1/15, flip:"x", loop: true },

    Q.animations("player", {
      walk_right: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8], rate: 1/8, flip: false, loop: true },
      walk_left: { frames:  [0, 1, 2, 3, 4, 5, 6, 7, 8], rate: 1/8, flip:"x", loop: true },
      jump_right: { frames: [13], rate: 1/10, flip: false },
      jump_left: { frames:  [13], rate: 1/10, flip: "x" },
      stand_right: { frames:[14], rate: 1/10, flip: false },
      stand_left: { frames: [14], rate: 1/10, flip:"x" },
      duck_right: { frames: [15], rate: 1/10, flip: false },
      duck_left: { frames:  [15], rate: 1/10, flip: "x" },
      climb: { frames:  [16, 17], rate: 1/3, flip: false }
    });

    var EnemyAnimations = {
      walk: { frames: [0,1], rate: 1/3, loop: true },
      dead: { frames: [2], rate: 1/10 }
    };
    Q.animations("snail", EnemyAnimations);

    Q.stageScene("start");
  }, {
  progressCallback: function(loaded,total) {
    var container, element;

    element = document.getElementById("loading-progress");
    element.style.width = Math.floor(loaded / total * 100) + "%";
    if (loaded === total) {
     container = document.getElementById("loading");
     container.parentNode.removeChild(container);
    }
  }
});

// document.getElementById('quintus').focus();
