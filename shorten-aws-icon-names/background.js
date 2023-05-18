init = (tab) => {
  if (!tab) {
    console.log('Tab not found');
    return;
  }

  // Check if the tab URL matches the AWS Console pattern
  if (/^https?:\/\/([a-z0-9-]+\.)*console\.aws\.amazon\.com\//.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ['content_script.js'],
      })
      .catch((error) => {
        console.log(`Error executing script: ${error}`);
      });
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.status === 'complete') {
    init(tab);
  }
});
