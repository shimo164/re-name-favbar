import { defaultMapping } from './scripts/mappings.mjs';
import { init } from './scripts/init.mjs';

// Listen for when the extension is first installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  switch (details.reason) {
    case 'install':
      // This is a first-time install
      initializeExtensionSettings();
      break;
    case 'update':
      // The extension has been updated
      logUpdateDetails(details);
      break;
  }
});

// Listen for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.status === 'complete') {
    // The tab has finished loading, so we initialize our script
    init(tab);
  }
});

// Initializes the settings of the extension on first-time install
function initializeExtensionSettings() {
  chrome.storage.sync.set(
    {
      extensionEnabled: true, // Enable the extension by default
      emptyAllNames: false, // Don't empty all service names by default
      textMappings: defaultMapping, // Set the default text mappings
    },
    () => console.log('Initial settings have been saved'),
  );
}

// Logs the details of the extension update
function logUpdateDetails(details) {
  const thisVersion = chrome.runtime.getManifest().version;
  console.log(`Updated from ${details.previousVersion} to ${thisVersion}!`);
}
