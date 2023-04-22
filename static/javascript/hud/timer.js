function startTimer() {
    let hours = document.getElementById("hours").textContent;
    let minutes = document.getElementById("minutes").textContent;
    let seconds = document.getElementById("seconds").textContent;
    var appendSeconds = document.getElementById("seconds")
    var appendMinutes = document.getElementById("minutes")
    var appendHours = document.getElementById("hours")
    setInterval(() => {
        // The no-life achievement
        // Check to see if user has at least 1 hour of activity (You can adjust how long)
        if (hours >= 1) {
            let noLife = document.querySelector('#noLife');
            if (noLife.value != 'true') {
                noLife.value = 'true';
            }
        }

        seconds++;

        if (seconds <= 9) {
            appendSeconds.innerHTML = "0" + seconds;
        }

        if (seconds > 9) {
            appendSeconds.innerHTML = seconds;
        }

        if (seconds > 59) {
            minutes++;
            appendMinutes.innerHTML = "0" + minutes;
            seconds = 0;
            appendSeconds.innerHTML = "0" + 0;
        }

        if (minutes > 9) {
            appendMinutes.innerHTML = minutes;
        }

        if (minutes > 59) {
            hours++;
            appendHours.innerHTML = "0" + hours;
            minutes = 0;
            appendMinutes.innerHTML = "0" + 0;
        }

        if (hours > 9) {
            appendHours.innerHTML = hours;
        }
    }, 1000)
}