const span = document.getElementById("chat-bubble");
let typing = false;
span.i = 0; // Initialize i as a property of span

async function typeWriter(text, delay = 50) {
  if (span.i == 0) {
    span.style.opacity = "0";
    span.innerHTML = "";
  }
  span.style.opacity = "1";
  while (span.i < text.length) {
    if (text.charAt(span.i) === ' '){
        span.innerHTML += "&nbsp;";
    } else {
      span.innerText += text.charAt(span.i);
    }
    span.i++;
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

async function triggerDialogue(dialogue) {
  if (typing) return; // Check if already typing
  typing = true;
  span.i = 0; // Reset i
  await typeWriter(dialogue[0]); // Say first piece of dialogue
  for (const text of dialogue.slice(1)) { // Say the rest
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    span.i = 0; // Reset i
    await typeWriter(text);
  }
  typing = false; // Set typing flag to false
}

// // Example of how to use triggerDialogue()
// window.addEventListener('load', async function() {
//   await triggerDialogue(["Hello, how are you today?", "I'm doing well, thank you for asking.", "That's great to hear!"]);
// });
