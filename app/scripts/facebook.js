Q.GameObject.extend("User", { 
   uid: 0,
   loggedIn: false,
   accesssToken: '',

   init: function() { 

   },
  
  connect: function() {
    FB.login();
  },

  disconnect: function() {
    FB.logout();
  },

  resetUser: function(response) {
    if (response.status === 'connected') {
      uid = response.authResponse.userID;
      accessToken = response.authResponse.accessToken;
      loggedIn = true;
    } else if (response.status === 'not_authorized') {
      uid = 0;
      accessToken = "";
      loggedIn = false;
    } else {
      uid = 0;
      accessToken = "";
      loggedIn = false;
    }

      if (uid !== this.uid && accessToken !== this.accessToken && loggedIn !== this.loggedIn) {
        this.uid = uid;
        this.accessToken = accessToken;
        this.loggedIn = loggedIn;

        Q.Game.storageKeys = {
          availableLevel: "bugRun:" + this.uid + ":availableLevel",
          isAudioMuted: "bugRun:" + this.uid + "isAudioMuted",
          isMuiscMuted: "bugRun:" + this.uid + "isMusicMuted"
        };
        Q.AudioManager.init();
        Q.Game.availableLevel = localStorage.getItem(Q.Game.storageKeys.availableLevel) || 1;
      }    
  },

  getLoginStatus: function() {
    var that = this,
      uid, accessToken, loggedIn, trigger;

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        uid = response.authResponse.userID;
        accessToken = response.authResponse.accessToken;
        loggedIn = true;
        trigger = "userLogin";
      } else if (response.status === 'not_authorized') {
        uid = 0;
        accessToken = "";
        loggedIn = false;
        trigger = "userLogout";
      } else {
        uid = 0;
        accessToken = "";
        loggedIn = false;
        trigger = "userLogout";
      }
      if (uid !== that.uid && accessToken !== that.accessToken && loggedIn !== that.loggedIn && trigger) {
        that.uid = uid;
        that.accessToken = accessToken;
        that.loggedIn = loggedIn;

        Q.Game.storageKeys = {
          availableLevel: "bugRun:" + that.uid + ":availableLevel",
          isAudioMuted: "bugRun:" + that.uid + "isAudioMuted",
          isMuiscMuted: "bugRun:" + that.uid + "isMusicMuted"
        };
        Q.AudioManager.init();
        Q.Game.availableLevel = localStorage.getItem(Q.Game.storageKeys.availableLevel) || 1;

        that.trigger(trigger);
      }
    });
  }
});



window.fbAsyncInit = function() {
  FB.init({
    appId      : '610705035680939',
    status     : true,
    xfbml      : false
  });

  Q.Game.User = new Q.User();

  FB.Event.subscribe('auth.authResponseChange', function(response){
    if (response.status === "connected") {
      Q.Game.User.trigger("userLogin", response);
    } else {
      Q.Game.User.trigger("userLogout", response);
    }
    Q.Game.User.resetUser(response);
  });


};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

