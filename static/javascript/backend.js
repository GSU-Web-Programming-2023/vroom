// // Example POST request
// window.addEventListener('load', function() {
//   const url = 'http://localhost:5000/api/endpoint/';
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
    const url = 'http://localhost:5000/api/endpoint/';
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
            let aPane = document.getElementsByClassName("achievements-pane")[0];
            let achievements = data['achievements'];
            for (achievement of achievements) {
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
            let hours = document.getElementById("hours");
            let minutes = document.getElementById("minutes");
            let seconds = document.getElementById("seconds");
            hours.textContent = data["hours"];
            minutes.textContent = data["minutes"];
            seconds.textContent = data["seconds"];
            loadGame(data);
            console.log(`${data['user']} just logged in`);
          }
        }).catch(error => alert(error));
    }
  }
  
function register () {
    const url = 'http://localhost:5000/api/endpoint/';
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
  const url = 'http://localhost:5000/api/endpoint/';

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
  username = data['user'];
  let user_elem = document.getElementById('user');
  user_elem.value = username;
  user_id = data['user-id'];
  let user_id_elem = document.getElementById('user-id');
  user_id_elem.value = user_id;
  let game = document.getElementById('game');
  game.style.display = 'block';
  let landing = document.getElementById('landing-page');
  landing.style.opacity = "0";
  landing.style.display = "none";
  let hudControls = document.getElementById('hud-controls');
  hudControls.style.opacity = "1";
  let miniMap = document.getElementById('minimap');
  miniMap.style.opacity = "1";
  let hud = document.getElementsByClassName('hud')[0];
  hud.style.opacity = "1";
  let pauseMenu = document.getElementById('pause-menu');
  pauseMenu.style.display = "none";
  startTimer();
  save()
  setInterval(() => {save()}, 4000); // Autosave every 4 seconds
}