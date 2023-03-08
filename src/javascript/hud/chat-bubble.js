const span = document.getElementById("chat-bubble");
const text = span.innerText;
span.innerText = "";

let i = 0;
function typeWriter() {
  if (i < text.length) {
    if (text.charAt(i) === ' '){
        span.innerHTML += "&nbsp;";
    } else {
      span.innerText += text.charAt(i);
  }
    i++;
    setTimeout(typeWriter, Math.floor(Math.random() * 150) + 50); // add a slight delay between each character typed
  }
}

window.addEventListener('load', function() {
  typeWriter();
});
