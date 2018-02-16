  let ajax_worker = new SharedWorker("/javascripts/workers/ajax_worker.js");

  emerald.ready(function() {
      var cookie = emerald.cookie.retrieve(),
          overlay = document.getElementById("mainPageButtons").parentNode,
          login = document.getElementById("loginBody");

      if (!cookie.game) {
          emerald.showHide(overlay);
      }
      var game = document.getElementById("gameName").innerHTML = `: ${cookie.game}`;
      document.getElementById("changeGame").addEventListener("click", function() {
          emerald.showHide(overlay)
      })
      document.getElementById("login").addEventListener("click", function() {
        emerald.showHide(login);
      })


      let buttons = overlay.getElementsByTagName("button");
      for (var i = buttons.length - 1; i >= 0; i--) {
          buttons[i].addEventListener("click", function() {
              cookie = emerald.cookie.retrieve();
              cookie.game = this.id;
              emerald.cookie.store(cookie);
              document.getElementById("gameName").innerHTML = `: ${cookie.game}`;
              document.dispatchEvent(new Event("populate"));
              emerald.showHide(overlay);
          })
      }

      cookie = emerald.cookie.retrieve();
      if(cookie.id){
        console.log(cookie)
        let target = document.querySelector("#login");
        target.id = "loggedIn";
        target.innerText = `Welcome ${cookie.name}`;
        emerald.listener.removeAll(target);
        document.querySelector("#loggedIn").addEventListener("click", function(){
          let profile = document.querySelector("#profile");
          emerald.showHide(profile);
          profile.querySelector(".nameValue").innerText = cookie.name;
          profile.querySelector(".roleValue").innerText = cookie.type;
        });
      }
      let dropDown = document.getElementById("sheets_dropdown");
      document.getElementById("sheets_button").addEventListener("mouseover", function()
      {        
        emerald.showHide(dropDown, 'show');
      })
      document.getElementById("sheets_button").addEventListener("mouseleave", function(){

        emerald.showHide(dropDown, 'hide');
      })

      dropDown.addEventListener("mouseover", function()
      {        
        emerald.showHide(dropDown, 'show');
      })
      dropDown.addEventListener("mouseleave", function(){

        emerald.showHide(dropDown, 'hide');
      })

  });





  if (emerald.cookie.retrieve().logged_in === true) {

  }




  /*
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/service_worker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }*/