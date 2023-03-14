// Hide chat bubble when clicked
let chatBubble = document.getElementById('chat-bubble');
window.addEventListener('load', function() {
  chatBubble.addEventListener('click', function(event) {
    let opacity = 1;
    let timer = setInterval(function() {
      if (opacity <= 0.1) {
        clearInterval(timer);
        chatBubble.style.display = 'none';
      }
      chatBubble.style.opacity = opacity;
      opacity -= opacity * 0.1;
    }, 15);
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
