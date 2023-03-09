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

setTimeout(function() {
  let opacity = 1;
  let timer = setInterval(function() {
    if (opacity <= 0.1) {
      clearInterval(timer);
      span.style.display = 'none';
    }
    span.style.opacity = opacity;
    opacity -= opacity * 0.1;
  }, 25);
}, 25000);