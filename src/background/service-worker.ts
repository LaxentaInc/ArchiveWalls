// extension background service worker handling programmatic new tab redirects and media clipping

const NEW_TAB_URL = chrome.runtime.getURL('src/newtab/index.html');

// intercept new tab creation and redirect to extension dashboard
chrome.tabs.onCreated.addListener((tab) => {
  if (tab.pendingUrl === 'chrome://newtab/' || tab.url === 'chrome://newtab/') {
    if (tab.id !== undefined) {
      chrome.tabs.update(tab.id, {
        url: NEW_TAB_URL,
      });
    }
  }
});

// also intercept url changes in case of lazy tab navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url === 'chrome://newtab/') {
    chrome.tabs.update(tabId, {
      url: NEW_TAB_URL,
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  // register context menu item for web media clipper
  chrome.contextMenus.create({
    id: 'archive-to-colorwall',
    title: 'Send to ColorWall Desktop',
    contexts: ['image', 'video'],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'archive-to-colorwall') {
    const targetMediaUrl = info.srcUrl || info.linkUrl;
    if (targetMediaUrl) {
      // download media payload to local disk
      chrome.downloads.download({
        url: targetMediaUrl,
        saveAs: false,
      });
    }
  }
});
