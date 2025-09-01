// Get references to the DOM elements we need to control
const eyesContainer = document.getElementById('eyes');
const mouthElement = document.getElementById('mouth');
const dynamicImage = document.getElementById('dynamic-image'); // New image element
const card = document.getElementById('card'); // New image element


/**
 * Updates the eyes' visual state by adding or removing the 'closed' class.
 * @param {string} state - The desired state, either 'open' or 'closed'.
 */
function setEyes(state) {
  const isClosed = state === 'closed';
  // Add the 'closed' class if the state is 'closed', otherwise remove it.
  eyesContainer.classList.toggle('closed', isClosed);
}

/**
 * Updates the mouth's visual state by adding or removing the 'speaking' class.
 * @param {boolean} speaking - Whether the mouth should be in a speaking state.
 */
function setSpeaking(speaking) {
  // Add the 'speaking' class if 'speaking' is true, otherwise remove it.
  mouthElement.classList.toggle('speaking', speaking);
}

function showImage(url) {
  dynamicImage.src = url;
  dynamicImage.style.display = 'block';
  card.style.display = 'none';
}

/**
 * --- NEW: Hides the image and clears its source. ---
 */
function removeImage() {
  dynamicImage.src = '';
  dynamicImage.style.display = 'none';
  card.style.display = 'block';
}

// --- IPC Listeners ---
// These listeners receive messages from the main process (main.js)
// via the secure bridge set up in preload.js.

// Listen for messages on the 'face:eyes' channel.
// The payload will be an object like { state: 'open' } or { state: 'closed' }.
window.faceApi.onEyesChange(({ state }) => {
  setEyes(state);
});

// Listen for messages on the 'face:speak' channel.
// The payload will be an object like { speaking: true } or { speaking: false }.
window.faceApi.onSpeakChange(({ speaking }) => {
  setSpeaking(speaking);
});

window.faceApi.onShowImage(({ url }) => {
  showImage(url);
});

window.faceApi.onRemoveImage(() => {
  removeImage();
});

// --- Initial State ---
// Set the default appearance of the face when the app first loads.
document.addEventListener('DOMContentLoaded', () => {
  setEyes('open'); // Start with eyes open
  setSpeaking(false); // Start with mouth not speaking
  removeImage(); // Ensure image is hidden on start
});
