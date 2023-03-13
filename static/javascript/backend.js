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
            console.log(`Welcome back ${data['user']}`)
            let landing = document.getElementById('landing-page');
            landing.style.opacity = "0";
            let hud = document.getElementsByClassName('hud')[0];
            hud.style.opacity = "1";
            startTimer();
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
            console.log(`${data['user']} just registered`)
            let landing = document.getElementById('landing-page');
            landing.style.opacity = "0";
            let hud = document.getElementsByClassName('hud')[0];
            hud.style.opacity = "1";
            startTimer();
            achievement("1,000 &ndash; Hello World!");
            }
        }).catch(error => alert(error));
        } else {
        alert("Your passwords do not match. Please try again.");
        }
    }
}