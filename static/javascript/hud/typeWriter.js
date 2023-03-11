const span = document.getElementById("chat-bubble");
span.style.display = "none";

let i = 0;
function typeWriter(text) {
  span.style.display = "block";
  if (i < text.length) {
    if (text.charAt(i) === ' '){
        span.innerHTML += "&nbsp;";
    } else {
      span.innerText += text.charAt(i);
  }
    i++;
    // add a slight delay between each character typed
    setTimeout(typeWriter, Math.floor(Math.random() * 100), text);
  }
}

// Example of how to user typeWriter()
// window.addEventListener('load', function() {
//   typeWriter("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Pretty useful for testing the character limit of npc dialogue text.");
// });
