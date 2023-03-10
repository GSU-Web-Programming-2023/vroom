window.addEventListener('load', function() {
    var hours = 00; 
    var minutes = 00; 
    var seconds = 00; 
    var appendSeconds = document.getElementById("seconds")
    var appendMinutes = document.getElementById("minutes")
    var appendHours = document.getElementById("hours")
    setInterval(() => {
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
});