const span = document.getElementById("chat-bubble");

let i = 0;
function typeWriter(text) {
  if (i == 0) {
    span.style.opacity = "0";
    span.innerHTML = "";
  }
  span.style.opacity = "1";
  if (i < text.length) {
    if (text.charAt(i) === ' '){
        span.innerHTML += "&nbsp;";
    } else {
      span.innerText += text.charAt(i);
    }
    i++;
    // add a slight delay between each character typed
    setTimeout(typeWriter, Math.floor(Math.random() * 100), text);
  } else {
    // make the text disappear after about 5 seconds
    setTimeout(() => {
      span.style.opacity = "0";
      i = 0;
    }, 5000);
  }
}

// Example of how to user typeWriter()
// window.addEventListener('load', function() {
//   typeWriter("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Pretty useful for testing the character limit of npc dialogue text.");
// });
