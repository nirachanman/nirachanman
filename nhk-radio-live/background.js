chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.setOptions({
    tabId: tab.id,
    path: 'sidebar.html',
    enabled: true
  }, () => {
    chrome.sidePanel.open({ tabId: tab.id });
  });
});
