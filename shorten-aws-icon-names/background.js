init = (tab) => {
  // Check if the tab URL matches the AWS Console pattern
  if (/^https?:\/\/([a-z0-9-]+\.)*console\.aws\.amazon\.com\//.test(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      files: ['content_script.js'],
    });
  }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    chrome.tabs.get(tabId, (tab) => {
      init(tab);
    });
  }
});
