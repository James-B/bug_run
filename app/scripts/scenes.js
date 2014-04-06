Q.scene('info',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                  label: "Continue" })); 
  if (stage.options.msg === 1) {
    var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                   label: "1"}));
  } else if (stage.options.msg === 2) {
//    var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
//                                                   label: stage.options.msg }));
  }


  button.on("click",function() {
    Q.stage(0).unpause(); 
    Q.clearStage(2);
  });

  container.fit(20);
  Q.stage(0).pause(); 
});

Q.scene('pauseMenu',function(stage) {
  var menuBtn, restartBrn, continueBtn,
    container = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));

  container.insert(new Q.UI.Text({
    x: 0,
    y: -80,
    label: "Game Paused",
    color: "#e83714",
    family: "Finger Paint",
    size: 60
  }));

  menuBtn = container.insert(new Q.UI.Button({ x: 0, y: -10, fill: "#CCCCCC", label: "Main Menu" })); 
  restartBtn = container.insert(new Q.UI.Button({ x: 0, y: 50, fill: "#CCCCCC", label: "Restart Level" })); 
  continueBtn = container.insert(new Q.UI.Button({ x: 0, y: 110, fill: "#CCCCCC", label: "Continue" })); 
  
  continueBtn.on("click",function() {
    Q.stage(0).unpause(); 
    Q.clearStage(2);
  });
  
  restartBtn.on("click",function() {
    Q.stage(0).unpause(); 
    Q.clearStage(2);
    Q.Game.stageLevel(Q.state.get("currentLevel"));
  });

  menuBtn.on("click",function() {
    Q.stage(0).unpause(); 
    Q.clearStage(2);
    Q.Game.stageLevelSelectScreen();
  });

  container.fit(20);

});

Q.scene("start", function(stage) {
  var fbButton, button, titleContainer;

  titleContainer = stage.insert(new Q.UI.Container({
    x: Q.width / 2,
    y: Q.height / 2
  }));

  titleContainer.insert(new Q.UI.Text({
    x: 0,
    y: -60,
    label: "Bug Run",
    color: "#e83714",
    family: "Finger Paint",
    size: 120
  }));
  titleContainer.fit();

  button = titleContainer.insert(new Q.UI.Button({
    x: 0,
    y: 80,
    w: Q.width / 3,
    h: 70,
    fill: "#c4da4a",
    radius: 10,
    fontColor: "#353b47",
    font: "400 48px Finger Paint",
    label: "Play",
    keyActionName: "Play",
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
  }));

  return button.on("click", function(e) {
    Q.Game.stageLevelSelectScreen();
  });

});  

Q.scene("levelSelect", function(stage) {
  var marginXinP = 10,
    marginYinP = 20,
    gutterXinP = 8,
    gutterYinP = 14,
    columnsNo = 3,
    columnInP = (100 - (marginXinP * 2) - (columnsNo - 1) * gutterXinP) / columnsNo,
    marginX = Q.width * marginXinP * 0.01,
    gutterX = Q.width * gutterXinP * 0.01,
    columnWidth = Q.width * columnInP * 0.01,
    marginY = Q.height * marginYinP * 0.01,
    gutterY = Q.height * gutterYinP * 0.01,
    rowHeight = Q.height * 0.22,
    x = marginX + columnWidth / 2,
    y = marginY + rowHeight / 2,
    w = columnWidth,
    h = rowHeight;

  for (item = i = 0; i <= 5; item = ++i) {
    if (item % columnsNo === 0) {
      x = marginX + columnWidth / 2;
      if (item > 0) {
        y += rowHeight + gutterY;
      }
    }


    enabled = item + 1 <= Q.Game.availableLevel ? true : false;
    container = stage.insert(new Q.UI.Container({
      x: x,
      y: y
    }));

    x += columnWidth + gutterX;
    button = new Q.UI.LevelButton({
        level: item + 1,
        x: 0,
        y: 0,
        w: w,
        h: h,
        level: item + 1,        
        enabled: enabled
      });
    container.insert(button);
    level = item + 1
    var stars = Q.Game.getStars(level);
    var score = Q.Game.getScore(level);

    if (stars == 3) {
      container.insert(new Q.UI.StarImg({x: -50, y: 60, scale: 0.5}));
      container.insert(new Q.UI.StarImg({x: +50, y: 60, scale: 0.5}));
      container.insert(new Q.UI.StarImg({x: 0, y: 50, scale: 0.5}));
    } else if (stars == 2) {
      container.insert(new Q.UI.StarImg({x: -30, y: 60, scale: 0.5}));
      container.insert(new Q.UI.StarImg({x: +30, y: 60, scale: 0.5}));
    }  else if (stars == 1) {
      container.insert(new Q.UI.StarImg({x: 0, y: 50, scale: 0.5}));
    } 

    if (score > 0) {
      container.insert(new Q.UI.Text({
        x: 0,
        y: 100,
        label: score.toString(),
        size: 30    
      }));
    }
  }

  stage.insert(new Q.UI.Text({
    x: Q.width / 2,
    y: 50,
    label: "Select a Level",
    color: "#353b47",
    family: "Finger Paint",
    size: 60    
  }));

  fbButton = stage.insert(new Q.UI.FBButton({
    x: Q.width / 2,
    y: Q.height - 50,
    scale: 0.75,
    keyActionName: "Connect",
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
  }));

  Q.Game.User.on("userLogin", function(response) {
    fbButton.p. sheet = "ui_fb_logout";
    Q.Game.User.resetUser(response);
    Q.clearStages();
    Q.stageScene("levelSelect");
  });

  Q.Game.User.on("userLogout", function(response) {
    fbButton.p. sheet = "ui_fb_connect";
    Q.Game.User.resetUser(response);
    Q.clearStages();
    Q.stageScene("levelSelect");
  });

  audioButton = stage.insert(new Q.UI.AudioButton({
      y: marginY / 2
  }));
  audioButton.p.x = Q.width - 50;

  musicButton = stage.insert(new Q.UI.MusicButton({
      y: audioButton.p.y + 75
  }));
  musicButton.p.x = Q.width - 50;

  shareButton = stage.insert(new Q.UI.ShareButton({
      y: musicButton.p.y + 75
  }));
  shareButton.p.x = Q.width - 50;
  
  helpButton = stage.insert(new Q.UI.HelpButton({
      y: shareButton.p.y + 75
  }));
  helpButton.p.x = Q.width - 50;

  Q.Game.User.getLoginStatus();
});  

Q.scene('hud',function(stage) {
  var container = stage.insert(new Q.UI.Container({
    x: 50,
    y: 0
  }));
  container.insert(new Q.UI.AppleImg());
  container.insert(new Q.UI.HUDApples());
  container.insert(new Q.UI.HUDScore());

  container.fit(20);

});

Q.scene("level1",function(stage) {
  Q.stageTMX("level1.tmx",stage);
  var player = Q("Player").first(),
      width = player.p.width,
      height = player.p.height;

  stage.add("viewport").follow(Q("Player").first(), {
        x: true,
        y: true
      }, {
        minX: 0,
        maxX: width * 70,
        minY: 0,
        maxY: height * 70
      });
});

Q.scene("level2",function(stage) {
  Q.stageTMX("level2.tmx",stage);
  stage.add("viewport").follow(Q("Player").first(), {
        x: true,
        y: true
      }, {
        minX: 0,
        maxX: 145 * 70,
        minY: 0,
        maxY: 43 * 70
      });
});

Q.scene("level3",function(stage) {
  Q.stageTMX("level3.tmx",stage);
    stage.add("viewport").follow(Q("Player").first(), {
        x: true,
        y: true
      }, {
        minX: 0,
        maxX: 145 * 70,
        minY: 0,
        maxY: 43 * 70
      });
});

Q.scene("level4",function(stage) {
  Q.stageTMX("level4.tmx",stage);
    stage.add("viewport").follow(Q("Player").first(), {
        x: true,
        y: true
      }, {
        minX: 0,
        maxX: 145 * 70,
        minY: 0,
        maxY: 43 * 70
      });
});

Q.scene("level5",function(stage) {
  Q.stageTMX("level5.tmx",stage);
    stage.add("viewport").follow(Q("Player").first(), {
        x: true,
        y: true
      }, {
        minX: 0,
        maxX: 145 * 70,
        minY: 0,
        maxY: 43 * 70
      });
});

Q.scene("level6",function(stage) {
  Q.stageTMX("level6.tmx",stage);
  var player = Q("Player").first(),
      width = player.p.width,
      height = player.p.height;

  stage.add("viewport").follow(Q("Player").first(), {
        x: true,
        y: true
      }, {
        minX: 0,
        maxX: width * 70,
        minY: 0,
        maxY: height * 70
      });
});

Q.scene('help',function(stage) {
  var marginY = Q.height * 0.3,
    marginXinP = 10,
    gutterXinP = 4,
    columnsNo = 2,
    columnInP = (100 - (marginXinP * 2) - (columnsNo - 1) * gutterXinP) / columnsNo,
    gutterX = Q.width * gutterXinP * 0.01,
    marginX = Q.width * marginXinP * 0.01,
    columnWidth = Q.width * columnInP * 0.01,    
    lineHeight = 60;
  
  stage.insert(new Q.UI.Text({
    x: Q.width / 2,
    y: 50,
    label: 'Help',
    color: "#e83714",
    family: "Finger Paint",
    size: 60
  }));

  var infoContainer = stage.insert(new Q.UI.Container({
    fill: "#444444",
    opacity: 0.5,
    x: Q.width / 2 - columnWidth - gutterX,
    y: Q.height / 2
  }));

  infoContainer.insert(new Q.UI.Text({
    x: 0 + columnWidth / 2,
    y: -lineHeight * 2,
    label: "Help Lyle get through the \nlevel by collecting all the \napples to unlock the next\nchallenge.",
    color: "#000000",
    family: "Finger Paint",
    size: 26,
  }));
  infoContainer.fit(20);

  var container = stage.insert(new Q.UI.Container({
    fill: "gray",
    opacity: 0.5,
    x: Q.width / 2 + columnWidth + gutterX,
    y: Q.height / 2
  }));

  container.insert(new Q.UI.Text({
    x: 0 - columnWidth / 2 - gutterX,
    y: -lineHeight * 2,
    label: "Move Left: ",
    color: "#444444",
    family: "Finger Paint",
    size: 26
  }));

  container.insert(new Q.Sprite({
    x: -80,
    y: -lineHeight * 2,
    sheet: "ui_left_arrow",
    scale: 0.5
  }));

  container.insert(new Q.UI.Text({
    x: 0 - columnWidth / 2 - gutterX,
    y: -lineHeight,
    label: "Move Right: ",
    color: "#444444",
    family: "Finger Paint",
    size: 26
  }));

  container.insert(new Q.Sprite({
    x: -80,
    y: -lineHeight,
    sheet: "ui_right_arrow",
    scale: 0.5
  }));

  container.insert(new Q.UI.Text({
    x: 0 - columnWidth / 2 - gutterX,
    y: 0,
    label: "Jump / Climb: ",
    color: "#444444",
    family: "Finger Paint",
    size: 26
  }));

  container.insert(new Q.Sprite({
    x: -80,
    y: 0,
    sheet: "ui_up_arrow",
    scale: 0.5
  }));

  container.fit(20);

  var buttonBack = stage.insert(new Q.UI.Button({
    x: Q.width / 2,
    y: Q.height - 100,
    w: Q.width / 4,
    h: 80,
    fill: "#f2da38",
    radius: 10,
    fontColor: "#353b47",
    font: "400 48px Finger Paint",
    label: "Continue",
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
  }));

  buttonBack.on("click", function(e) {
    return Q.Game.stageLevelSelectScreen();
  }); 
});

Q.scene("endGame",function(stage) {
  var marginY = Q.height * 0.3,
    marginXinP = 20,
    gutterXinP = 8,
    columnsNo = 2,
    columnInP = (100 - (marginXinP * 2) - (columnsNo - 1) * gutterXinP) / columnsNo,
    marginX = Q.width * marginXinP * 0.01,
    columnWidth = Q.width * columnInP * 0.01,    
    lineHeight = 60;

  stage.insert(new Q.UI.Text({
    x: Q.width / 2,
    y: marginY / 2,
    label: "Game Over",
    color: "#e83714",
    family: "Finger Paint",
    size: 100
  }));

  summaryContainer = stage.insert(new Q.UI.Container({
    fill: "gray",
    opacity: 0.5,
    x: Q.width / 2,
    y: Q.height / 2
  }));

  summaryContainer.insert(new Q.UI.Text({
    x: 0,
    y: -lineHeight * 2,
    label: "Score: " + Q.state.get('score'),
    color: "#444444",
    family: "Finger Paint",
    size: 36
  }));

  summaryContainer.insert(new Q.UI.Text({
    x: 0,
    y: -lineHeight,
    label: "Apples: " + Q.state.get("apples") + " / 6",
    color: "#444444",
    family: "Finger Paint",
    size: 36
  }));

  summaryContainer.insert(new Q.UI.Text({
    x: 0,
    y: 0,
    label: "Gold Gems: " + Q.state.get("goldGems") + " / " + Q.state.get("numGoldGems"),
    color: "#444444",
    family: "Finger Paint",
    size: 36
  }));

  if (Q.state.get("numSnails") > 0) {
    summaryContainer.insert(new Q.UI.Text({
      x: 0,
      y: +lineHeight,
      label: "Snails: " + Q.state.get("snails") + " / " + Q.state.get("numSnails"),
      color: "#444444",
      family: "Finger Paint",
      size: 36
    }));
  }

  summaryContainer.fit(20);

  buttonTryAgain = stage.insert(new Q.UI.Button({
    y: Q.height - 100,
    w: Q.width / 4,
    h: 80,
    fill: "#c4da4a",
    radius: 10,
    fontColor: "#353b47",
    font: "400 48px Finger Paint",
    label: "Try Again",
    keyActionName: "confirm",
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
  }));
  buttonTryAgain.p.x = Q.width / 2 + buttonTryAgain.p.w / 2 + 40;
  buttonTryAgain.on("click", function(e) {
    return Q.Game.stageLevel(Q.state.get("currentLevel"));
  });

  buttonBack = stage.insert(new Q.UI.Button({
    y: Q.height - 100,
    w: Q.width / 4,
    h: 80,
    fill: "#f2da38",
    radius: 10,
    fontColor: "#353b47",
    font: "400 48px Finger Paint",
    label: "All levels",
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
  }));
  buttonBack.p.x = Q.width / 2 - buttonBack.p.w / 2 - 40;
  buttonBack.on("click", function(e) {
    return Q.Game.stageLevelSelectScreen();
  }); 
});

Q.scene("levelSummary",function(stage) {
  var marginY = Q.height * 0.3,
    marginXinP = 10,
    gutterXinP = 4,
    columnsNo = 2,
    columnInP = (100 - (marginXinP * 2) - (columnsNo - 1) * gutterXinP) / columnsNo,
    gutterX = Q.width * gutterXinP * 0.01,
    marginX = Q.width * marginXinP * 0.01,
    columnWidth = Q.width * columnInP * 0.01,    
    lineHeight = 60,
    maxScore = 0,
    percent = 0,
    stars = 0,
    summaryContainer, starContainer;
 
  stage.insert(new Q.UI.Text({
    x: Q.width / 2,
    y: marginY / 2,
    label: "Level Complete!",
    color: "#e83714",
    family: "Finger Paint",
    size: 100
  }));

  summaryContainer = stage.insert(new Q.UI.Container({
    fill: "gray",
    opacity: 0.5,
    x: marginX + columnWidth / 2,
    y: Q.height / 2
  }));

  summaryContainer.insert(new Q.UI.Text({
    x: 0,
    y: -lineHeight * 2,
    label: "Score: " + Q.state.get('score'),
    color: "#444444",
    family: "Finger Paint",
    size: 36
  }));

  summaryContainer.insert(new Q.UI.Text({
    x: 0,
    y: -lineHeight,
    label: "Apples: " + Q.state.get("apples") + " / 6",
    color: "#444444",
    family: "Finger Paint",
    size: 36
  }));
  maxScore += 6 * 50;


  summaryContainer.insert(new Q.UI.Text({
    x: 0,
    y: 0,
    label: "Gold Gems: " + Q.state.get("goldGems") + " / " + Q.state.get("numGoldGems"),
    color: "#444444",
    family: "Finger Paint",
    size: 36
  }));
  maxScore += Q.state.get("numGoldGems") * 10;



  if (Q.state.get("numSnails") > 0) {
    summaryContainer.insert(new Q.UI.Text({
      x: 0,
      y: +lineHeight,
      label: "Snails: " + Q.state.get("snails") + " / " + Q.state.get("numSnails"),
      color: "#444444",
      family: "Finger Paint",
      size: 36
    }));
    maxScore += Q.state.get("numSnails") * 25;
  }

  summaryContainer.fit(20);

  starContainer = stage.insert(new Q.UI.Container({
    opacity: 0.5,
    x: marginX + columnWidth + gutterX + columnWidth / 2,
    y: Q.height / 3
  }));

  percent = Q.state.get('score') * 100 / maxScore; 
  
  if (percent >= 95) {
    starContainer.insert(new Q.UI.StarImg({x: -120, y: 10}));
    starContainer.insert(new Q.UI.StarImg({x: +120, y: 10}));
    starContainer.insert(new Q.UI.StarImg({x: 0}));
    stars = 3;
  } else if (percent >= 80) {
    starContainer.insert(new Q.UI.StarImg({x: -70}));
    starContainer.insert(new Q.UI.StarImg({x: +70}));
    stars = 2;
  }  else if (percent >= 60) {
    starContainer.insert(new Q.UI.StarImg({x: 0}));
    stars = 1;
  } 
  Q.Game.saveScore(Q.state.get('score'), stars, Q.state.get('currentLevel'), Q.Game.User.uid);
  starContainer.fit(20);

  if (Q.state.get("currentLevel") < 6) {  
      buttonNext = stage.insert(new Q.UI.Button({
        y: Q.height - 100,
        w: Q.width / 4,
        h: 80,
        fill: "#c4da4a",
        radius: 10,
        fontColor: "#353b47",
        font: "400 48px Finger Paint",
        label: "Play next",
        keyActionName: "confirm",
        type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
      }));
    buttonNext.p.x = Q.width / 2 + buttonNext.p.w / 2 + 40;
    buttonNext.on("click", function(e) {
      return Q.Game.stageLevel(Q.state.get("currentLevel") + 1);
    });
  }

  buttonBack = stage.insert(new Q.UI.Button({
    y: Q.height - 100,
    w: Q.width / 4,
    h: 80,
    fill: "#f2da38",
    radius: 10,
    fontColor: "#353b47",
    font: "400 48px Finger Paint",
    label: "All levels",
    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
  }));
  buttonBack.p.x = Q.width / 2 - buttonBack.p.w / 2 - 40;
  buttonBack.on("click", function(e) {
    return Q.Game.stageLevelSelectScreen();
  });
});