// extension background service worker handling programmatic new tab redirects and media clipping

const NEW_TAB_URL = chrome.runtime.getURL('src/newtab/index.html');

// helper to check if a url is targeting the default new tab
const isDefaultNewTab = (url?: string): boolean => {
  if (!url) return false;
  return url.startsWith('chrome://newtab') || url === 'about:blank';
};

// intercept new tab creation and redirect to extension dashboard
chrome.tabs.onCreated.addListener((tab) => {
  const targetUrl = tab.pendingUrl || tab.url;
  if (isDefaultNewTab(targetUrl) && tab.id !== undefined) {
    chrome.tabs.update(tab.id, {
      url: NEW_TAB_URL,
    });
  }
});

// also intercept url changes when tab finishes initializing
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const targetUrl = changeInfo.url || tab.pendingUrl || tab.url;
  if (isDefaultNewTab(targetUrl)) {
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
