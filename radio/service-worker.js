chrome.action.onClicked.addListener(async () => {
  try {
    if (chrome.sidePanel && chrome.sidePanel.open) {
      await chrome.sidePanel.open();
    } else {
      chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
    }
  } catch (e) {
    chrome.tabs.create({ url: chrome.runtime.getURL('sidepanel.html') });
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'fetchNHKNews') {
    fetch('https://www.nhk.or.jp/s-media/news/podcast/list/v1/all.xml')
      .then(res => res.text())
      .then(text => sendResponse({ success: true, xml: text }))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});
