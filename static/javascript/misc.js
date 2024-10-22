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
window.addEventListener('load', function () {
  dialogue.addEventListener('click', function (event) {
    fadeOut(this);
  });
});

// Show/Hide HUD controls when C is pressed
window.addEventListener('load', function () {
  document.addEventListener('keypress', function (event) {
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

// Show/Hide Pause Menu when P is pressed
function togglePauseMenu() {
  let menu = document.getElementById("pause-menu");
  let hud = document.querySelector(".hud");
  if (menu.style.display === "none") {
    if (window.innerWidth < 990) {
      menu.style.display = "inline";
      let mobileControls = document.querySelector(".mobile-controls-container");
      mobileControls.style.display = "none";
    } else {
      menu.style.display = "flex";
    }
    hud.style.opacity = "0";
  } else {
    menu.style.display = "none";
    hud.style.opacity = "1";
    if (window.innerWidth < 990) {
      let mobileControls = document.querySelector(".mobile-controls-container");
      mobileControls.style.display = "flex";
    }
  }
}

window.addEventListener('load', function () {
  document.addEventListener('keypress', function (event) {
    if (event.key === 'p') {
      togglePauseMenu();
    }
  });
});

// Show/Hide Debug Menu when ` is pressed
function debugMenuEventListener() {
  let debugMenu = document.querySelector(".dg.ac");
  if (debugMenu) {
    debugMenu.style.display = "none";
    document.addEventListener('keypress', function (event) {
      if (event.key === '\`') {
        if (debugMenu.style.display === "none") {
          debugMenu.style.display = "block";
        } else {
          debugMenu.style.display = "none";
        }
      }
    });
  }
}

//Implement logout (refresh) from inactivity after 5 minutes
// Define the number of seconds of inactivity before the page should reload (5 minute5)
let inactivityTime = 300; // 5 minutes

// Define a variable to store the ID of the interval timer
let timer_Id;

// Begin a timer that will reload the page after 5 minutes of inactivity
function beginTimer() {
  timer_Id = setTimeout(function () {
    location.reload();
  }, inactivityTime * 1000);
}

// Reset the timer each time the user interacts with the page
function resetTimer() {
  clearTimeout(timer_Id);
  beginTimer();
}

// Start a timer that will check for inactivity at a specified interval
setInterval(function () {
  // Add event listener to reset the timer on user interaction (moving mouse, pressing on a key, holding a key, clicking)
  document.addEventListener('mousemove', resetTimer);
  document.addEventListener('click', resetTimer);
  document.addEventListener('keydown', resetTimer);
  document.addEventListener('keypress', resetTimer);
}, 1000); // Check for inactivity every second