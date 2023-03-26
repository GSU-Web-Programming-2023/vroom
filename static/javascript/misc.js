function fadeOut(element) {
  let opacity = 1;
  const fadeEffect = setInterval(() => {
    if (opacity < 0.1) {
      clearInterval(fadeEffect);
    } else {
      opacity -= 0.1;
      element.style.opacity = opacity;
    }
  }, 50);
}

// Hide dialogue when clicked
let dialogue = document.getElementById('dialogue');
window.addEventListener('load', function() {
  dialogue.addEventListener('click', function(event) {
    fadeOut(this);
  });
});

// Show/Hide HUD controls when C is pressed
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

// Show/Hide HUD Minimap when M is pressed
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

// Show/Hide Pause Menu when M is pressed
window.addEventListener('load', function() {
  let menu = document.getElementById("pause-menu");
  menu.style.display = "none";
  document.addEventListener('keypress', function(event) {
    if (event.key === 'p') {
      if (menu.style.display === "none") {
        menu.style.display = "flex";
      } else {
        menu.style.display = "none";
      }
    }
  });
});

// Show/Hide Debug Menu when ` is pressed
window.addEventListener('load', function() {
  let menu = document.querySelector(".dg.ac");
  menu.style.display = "none";
  document.addEventListener('keypress', function(event) {
    if (event.key === '\`') {
      if (menu.style.display === "none") {
        menu.style.display = "block";
      } else {
        menu.style.display = "none";
      }
    }
  });
});