const { loginForm, registerForm } = document

function preventDefault(event) {
  event.preventDefault()
}

document.addEventListener("submit", preventDefault)

async function login() {
  const url = "/api/endpoint/"
  let username = document.getElementById("username1").value
  let password = document.getElementById("password1").value

  if (username === "" || password === "") {
    alert("Please enter both your username and password to log in.")
  } else {
    const data = {
      postType: "login",
      username: username,
      password: password,
    }
    response = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        if ("error" in data) {
          alert(data["error"])
        } else {
          let hours = document.getElementById("hours")
          let minutes = document.getElementById("minutes")
          let seconds = document.getElementById("seconds")
          hours.textContent = data["hours"]
          minutes.textContent = data["minutes"]
          seconds.textContent = data["seconds"]
          loadGame(data, (referrer = "login"))
          loadAchievements(data)
          console.log(`${data["user"]} just logged in`)
        }
      })
      .catch(error => alert(error))
  }
}

// A little hint for Naomi
function clearForm() {
  // fill in the relevant code here
}

async function register() {
  const url = "/api/endpoint/"
  let username = document.getElementById("username2").value
  let password = document.getElementById("password2").value
  let password2 = document.getElementById("password3").value

  if (username === "" || password === "" || password2 === "") {
    alert(
      "Please enter your username and password and confirm your password to register."
    )
  } else {
    if (password === password2) {
      const data = {
        postType: "register",
        username: username,
        password: password,
      }

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
        const responseData = await response.json()

        if ("error" in responseData) {
          alert(responseData["error"])
        } else {
          console.log(`${responseData["user"]} just registered`)
          // clearForm()
        }
      } catch (error) {
        alert(error)
      }
    } else {
      alert("Your passwords do not match. Please try again.")
    }
  }
}

const save = () => {
  const url = "/api/endpoint/"

  let username = document.getElementById("user").value
  let hours = document.getElementById("hours").textContent
  let minutes = document.getElementById("minutes").textContent
  let seconds = document.getElementById("seconds").textContent

  const data = {
    postType: "save",
    username: username,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  }

  response = fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(response => response.json())
    .then(data => {
      if ("error" in data) {
        alert(data["error"])
      } else {
        console.log(data)

        // Check for Achievements
        if (data["logins"] >= 1 && !data["earnedA1"]) {
          achievement(1)
        } else if (data["logins"] >= 10 && !data["earnedA2"]) {
          achievement(2)
        }

        let xb1TalkedTo = document.querySelector("#xb1TalkedTo")
        if (xb1TalkedTo.value === "true" && !data["earnedA3"]) {
          achievement(3)
        }

        // Check if 5 aliens have been hit
        if (
          document.querySelector("#aliensHit").value >= 5 &&
          !data["earnedA4"]
        ) {
          achievement(4)
        }

        // Check if user was refreshed for inactivity
        let refreshed = document.querySelector("#refreshed")
        if (refreshed.value === "true") {
          // Give achievement if first time
          if (!data["earnedA5"]) {
            achievement(5)
            //Wait 10 seconds for the achievement animation to appear before refresh
            setTimeout(function () {
              location.reload()
            }, 10000);
          }
          // Don't give if not first time
          else {
            location.reload()
          }
        }

        // Check for no life achievement
        let noLife = document.querySelector("#noLife")
        if (noLife.value === "true" && !data["earnedA6"]) {
          achievement(6)
        }
      }
    })
    .catch(error => console.log(error))
}

function loadGame(data, referrer = null) {
  // load webpack bundle file to start the game
  const script = document.createElement("script")
  script.src = "static/javascript/bundle.js"
  document.body.appendChild(script)

  // do stuff with user data
  username = data["user"]
  let user_elem = document.getElementById("user")
  user_elem.value = username
  user_id = data["user-id"]
  let user_id_elem = document.getElementById("user-id")
  user_id_elem.value = user_id
  let game = document.getElementById("game")
  game.style.opacity = "0"
  game.style.visibility = "visible"
  let landing = document.getElementById("landing-page")
  landing.style.opacity = "0"
  landing.style.visibility = "hidden"
  document.body.classList.remove('landing-page-visible');
  document.documentElement.classList.remove('landing-page-visible');
  let hudControls = document.getElementById("hud-controls")
  hudControls.style.opacity = "1"
  let hud = document.getElementsByClassName("hud")[0]
  let pauseMenu = document.getElementById("pause-menu")
  pauseMenu.style.display = "none"
  startTimer()
  save()
  // Autosave every 4 seconds
  setInterval(() => {
    save()
  }, 4000)

  setTimeout(() => {
    game.style.opacity = "1"
    game.style.display = "block"
    hud.style.opacity = "1"
    hud.style.display = "block"
    setTimeout(() => {
      debugMenuEventListener()
    }, 1000)
  }, 3000)

  if (referrer == "login") {
    setTimeout(() => triggerDialogue([`Welcome back, ${username}`]), 4000)
  }
}

function loadAchievements(data) {
  let aPane = document.querySelector(".achievements-pane")
  let achievements = data["achievements"]
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
    `
  }
}
