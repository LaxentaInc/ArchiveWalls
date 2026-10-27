// extension background service worker handling context menus and media clipping for colorwall
// new tab routing is handled natively via chrome_url_overrides in manifest.json to keep address bar clean

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
