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
          console.log(`Welcome back ${data['username']}`)
          let elem = document.getElementById('landing-page');
          elem.style.display = "none";
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
          console.log(`${data['username']} just registered`)
          let elem = document.getElementById('landing-page');
          elem.style.display = "none";
        }
      }).catch(error => alert(error));
    } else {
      alert("Your passwords do not match. Please try again.");
    }
  }
}

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

  // Hide HUD Minimap when M is pressed
  window.addEventListener('load', function() {
    document.addEventListener('keypress', function(event) {
        if (event.key === 'm') {
          // toggle the display of the element with id "myElement"
          let controls = document.getElementById("minimap");
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