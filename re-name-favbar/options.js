import { defaultMapping } from './scripts/mappings.mjs';

// ----- DOM Elements -----
const extensionToggle = document.getElementById('extensionToggle');
const emptyNamesToggle = document.getElementById('emptyNamesToggle');
const saveButton = document.getElementById('saveButton');
const resetButton = document.getElementById('resetButton');
const mappings = document.getElementById('mappings');
const saveMessage = document.getElementById('saveMessage');

// ----- Initialization -----
// When the options page is loaded, initialize states and display the current mappings.
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the toggle states from storage and initialize their states
  chrome.storage.sync.get(
    ['extensionEnabled', 'emptyAllNames'],
    function (data) {
      extensionToggle.checked = data.extensionEnabled !== false; // default: true
      emptyNamesToggle.checked = data.emptyAllNames === true; // default: false
    },
  );

  populateOptions();
});

// ----- Event Listeners -----
// Save the state of the toggles whenever they are changed.
extensionToggle.addEventListener('change', function () {
  chrome.storage.sync.set({ extensionEnabled: this.checked });
});
emptyNamesToggle.addEventListener('change', function () {
  chrome.storage.sync.set({ emptyAllNames: this.checked });
});

// Save and reset options
saveButton.addEventListener('click', saveOptions);
resetButton.addEventListener('click', resetOptions);

// ----- Helper Functions -----
// Display a message indicating when the mappings were last saved.
function displaySaveMessage() {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(now.getDate()).padStart(2, '0')} ${String(
    now.getHours(),
  ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(
    now.getSeconds(),
  ).padStart(2, '0')}`;
  saveMessage.textContent = `Saved at ${timestamp}`;
}

// Retrieve the current mappings from storage and display them on the options page.
function populateOptions() {
  chrome.storage.sync.get('textMappings', function (data) {
    mappings.value = convertMappingsToString(
      data.textMappings || defaultMapping,
    );
  });
}

// Save the user's mappings into storage and display a save message.
function saveOptions() {
  const userMappings = convertStringToMappings(mappings.value);
  chrome.storage.sync.set({ textMappings: userMappings }, displaySaveMessage);
}

// Reset the mappings to the defaults, save them into storage, and display them on the options page.
function resetOptions() {
  if (confirm('Are you sure you want to reset to default mappings?')) {
    chrome.storage.sync.set({ textMappings: defaultMapping }, () => {
      populateOptions();
      displaySaveMessage();
    });
  }
}

// Convert a mappings object to a string for display in the text area.
function convertMappingsToString(mappings) {
  let result = '';
  for (let key in mappings) {
    if (mappings.hasOwnProperty(key)) {
      result += `${key},${mappings[key]}\n`;
    }
  }
  return result;
}

// Convert a string from the text area to a mappings object for storage.
function convertStringToMappings(string) {
  const mappings = {};
  const lines = string.split('\n');
  lines.forEach((line) => {
    const [key, value] = line.split(',');
    if (key && value) {
      mappings[key.trim()] = value.trim();
    }
  });
  return mappings;
}
