const DEFAULTS = {
  liveAutoplay: false,
  newsAutoplay: false,
  stations: []
};

let settings = null;

// DOM要素取得
const liveAutoplayEl = document.getElementById('live-autoplay');
const newsAutoplayEl = document.getElementById('news-autoplay');
const nameEl = document.getElementById('station-name');
const urlEl = document.getElementById('station-url');
const regionEl = document.getElementById('station-region');
const addBtn = document.getElementById('add-station');
const listEl = document.getElementById('station-list');

// 設定読み込み
function loadSettings() {
  return new Promise(resolve => {
    chrome.storage.local.get(['nhk_radio_settings'], res => {
      resolve(res.nhk_radio_settings || DEFAULTS);
    });
  });
}

// 設定保存
function saveSettings() {
  return new Promise(resolve => {
    chrome.storage.local.set({ nhk_radio_settings: settings }, () => resolve());
  });
}

// ステーション一覧描画
function renderStations() {
  listEl.innerHTML = '';
  (settings.stations || []).forEach(station => {
    const div = document.createElement('div');
    div.className = 'station';

    const info = document.createElement('div');
    info.innerHTML = `<strong>${station.name}</strong><br><small>${station.region}</small><br><code>${station.streamUrl}</code>`;

    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.addEventListener('click', async () => {
      settings.stations = settings.stations.filter(s => s.id !== station.id);
      await saveSettings();
      renderStations();
    });

    div.appendChild(info);
    div.appendChild(delBtn);
    listEl.appendChild(div);
  });
}

// ステーション追加
addBtn.addEventListener('click', async () => {
  const name = nameEl.value.trim();
  const url = urlEl.value.trim();
  const region = regionEl.value.trim();

  if (!name || !url) return;

  const newStation = {
    id: 's' + Date.now(),
    name,
    streamUrl: url,
    region: region || '不明'
  };

  settings.stations.push(newStation);
  await saveSettings();
  renderStations();

  nameEl.value = '';
  urlEl.value = '';
  regionEl.value = '';
});

// 自動再生設定
liveAutoplayEl.addEventListener('change', async (e) => {
  settings.liveAutoplay = e.target.checked;
  await saveSettings();
});

newsAutoplayEl.addEventListener('change', async (e) => {
  settings.newsAutoplay = e.target.checked;
  await saveSettings();
});

// 初期化
(async function init() {
  settings = await loadSettings();

  liveAutoplayEl.checked = !!settings.liveAutoplay;
  newsAutoplayEl.checked = !!settings.newsAutoplay;

  renderStations();
})();
