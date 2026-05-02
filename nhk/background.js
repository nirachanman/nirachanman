chrome.action.onClicked.addListener(async (tab) => {
  // 拡張アイコンをクリックしたらサイドパネルを開く
  await chrome.sidePanel.open({ tabId: tab.id });
});
