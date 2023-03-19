// Hide chat bubble when clicked
let chatBubble = document.getElementById('chat-bubble');
window.addEventListener('load', function() {
  chatBubble.addEventListener('click', function(event) {
    let opacity = 1;
    let timer = setInterval(function() {
      if (opacity <= 0.1) {
        clearInterval(timer);
        chatBubble.style.opacity = '0';
      }
      chatBubble.style.opacity = opacity;
      opacity -= opacity * 0.1;
    }, 15);
    i = 0;
  });
});

// Hide HUD controls when C is pressed
window.addEventListener('load', function() {
  document.addEventListener('keypress', function(event) {
      if (event.key === 'c') {
      let controls = document.getElementById("hud-controls");
      if (controls.style.opacity === "0") {
        controls.style.opacity = "1";
      } else {
        controls.style.opacity = "0";
      }
    }
  });
});

// Hide HUD Minimap when M is pressed
window.addEventListener('load', function() {
  document.addEventListener('keypress', function(event) {
        if (event.key === 'm') {
        let minimap = document.getElementById("minimap");
        if (minimap.style.opacity === "0") {
          minimap.style.opacity = "1";
        } else {
          minimap.style.opacity = "0";
        }
      }
    });
  });

// Show/Hide Pause Menu
window.addEventListener('load', function() {
  document.addEventListener('keypress', function(event) {
    if (event.key === 'p') {
      let menu = document.getElementById("pause-menu");
      if (menu.style.display === "none") {
        menu.style.display = "flex";
      } else {
        menu.style.display = "none";
      }
    }
  });
});