
let chatBubble = document.getElementById('chat-bubble');

// Hide HUD controls when C is pressed
window.addEventListener('load', function() {
  document.addEventListener('keypress', function(event) {
      if (event.key === 'c') {
        // toggle the display of the element with id "myElement"
        let controls = document.getElementById("hud-controls");
        if (controls.style.display === "none") {
          controls.style.display = "block";
        } else {
          controls.style.display = "none";
        }
      }
    });
  });

// Hide chat bubble when clicked
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