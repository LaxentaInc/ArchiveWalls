// extension background service worker handling context menus and storage events

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
