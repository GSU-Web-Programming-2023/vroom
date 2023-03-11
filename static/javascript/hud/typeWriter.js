const span = document.getElementById("chat-bubble");
const text = span.innerText;
span.innerText = "";
span.style.display = "block";

let i = 0;
function typeWriter() {
  if (i < text.length) {
    if (text.charAt(i) === ' '){
        span.innerHTML += "&nbsp;";
    } else {
      span.innerText += text.charAt(i);
  }
    i++;
    // add a slight delay between each character typed
    setTimeout(typeWriter, Math.floor(Math.random() * 100));
  }
}

window.addEventListener('load', function() {
  typeWriter();
});
