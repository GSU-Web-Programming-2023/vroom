// // Example POST request
// window.addEventListener('load', function() {
//   const url = '/api/endpoint/';
//   const data = { name : 'Judah Paul' };

//   response = fetch(url, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
//   .then(response => console.log(response))
//   .catch(error => console.error(error));
// });

let loginForm = document.getElementById('login-form');
let registerForm = document.getElementById('register-form');
let username;

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
});
registerForm.addEventListener('submit', function(event) {
  event.preventDefault();
});

function login () {
    const url = '/api/endpoint/';
    let username = document.getElementById('username1').value;
    let password = document.getElementById('password1').value;
  
    if (username === "" || password === "") {
      alert("Please enter both your username and password to log in.");
    } else {
      const data = {
        postType : 'login',
        username : username,
        password : password
      };
      response = fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          if ('error' in data) {
              alert(data['error']);
          } else {
            let hours = document.getElementById("hours");
            let minutes = document.getElementById("minutes");
            let seconds = document.getElementById("seconds");
            hours.textContent = data["hours"];
            minutes.textContent = data["minutes"];
            seconds.textContent = data["seconds"];
            loadGame(data);
            loadAchievements(data);
            console.log(`${data['user']} just logged in`);
          }
        }).catch(error => alert(error));
    }
  }
  
function register () {
    const url = '/api/endpoint/';
    let username = document.getElementById('username2').value;
    let password = document.getElementById('password2').value;
    let password2 = document.getElementById('password3').value;

    if (username === "" || password === "" || password2 === "") {
        alert("Please enter your username and password and confirm your password to register.");
    } else {

        if (password === password2) {
        const data = {
            postType : 'register',
            username : username,
            password : password
        };

        response = fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if ('error' in data) {
                alert(data['error']);
            } else {
              console.log(`${data['user']} just registered`);
              loadGame(data);
            }
        }).catch(error => alert(error));
      } else {
      alert("Your passwords do not match. Please try again.");
      }
    }
}

function save () {
  const url = '/api/endpoint/';

  let username = document.getElementById('user').value;
  let hours = document.getElementById('hours').textContent;
  let minutes = document.getElementById('minutes').textContent;
  let seconds = document.getElementById('seconds').textContent;

  const data = {
    postType : 'save',
    username: username,
    hours : hours,
    minutes : minutes,
    seconds : seconds
  };
  response = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
      if ('error' in data) {
          alert(data['error']);
      } else {
        console.log(data);

        // Check for Achievements
        if (data['logins'] == 1 && !data['earnedA1']) {
          achievement(1);
        }
      }
    }).catch(error => console.log(error));
}

function loadGame(data) {
  // load webpack bundle file to start the game
  const script = document.createElement('script');
  script.src = 'static/javascript/bundle.js';
  document.body.appendChild(script);
  // do stuff with user data
  username = data['user'];
  let user_elem = document.getElementById('user');
  user_elem.value = username;
  user_id = data['user-id'];
  let user_id_elem = document.getElementById('user-id');
  user_id_elem.value = user_id;
  let game = document.getElementById('game');
  game.style.opacity = '0';
  game.style.visibility = 'visible';
  let landing = document.getElementById('landing-page');
  landing.style.opacity = '0';
  landing.style.visibility = 'hidden';
  let hudControls = document.getElementById('hud-controls');
  hudControls.style.opacity = '1';
  let miniMap = document.getElementById('minimap');
  miniMap.style.opacity = '1';
  let hud = document.getElementsByClassName('hud')[0];
  let pauseMenu = document.getElementById('pause-menu');
  pauseMenu.style.display = 'none';
  startTimer();
  save();
  // Autosave every 4 seconds
  setInterval(() => {save()}, 4000);

  setTimeout(() => {
    game.style.opacity = '1';
    game.style.display = 'block';
    hud.style.opacity = '1';
    hud.style.display = 'block';
    setTimeout(() => {debugMenuEventListener();}, 1000);
  }, 3000);
}

function loadAchievements(data) {
  let aPane = document.querySelector(".achievements-pane");
  let achievements = data['achievements'];
  for (let achievement of achievements) {
    aPane.innerHTML += `
      <div class='achievement'>
        <div class="aIcon">
          <i class="fa-solid fa-trophy"></i>
        </div>
        <div class="aContent">
          <div class='aName'>${achievement.name}</div>
          <hr class='animated-hr aHr'>
          <div class='aDescription'>${achievement.description}</div>
          <div class='aId'>${achievement.id}</div>
        </div>
      </div>
    `;
  }
}