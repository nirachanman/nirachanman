const DEFAULTS = {
  liveAutoplay: false,
  newsAutoplay: false,
  stations: []
};

function loadSettings() {
  const raw = localStorage.getItem('nhk_radio_settings');
  return raw ? JSON.parse(raw) : DEFAULTS;
}

function saveSettings(settings) {
  localStorage.setItem('nhk_radio_settings', JSON.stringify(settings));
}

let settings = loadSettings();

// DOM
const liveAutoplayEl = document.getElementById('live-autoplay-setting');
const newsAutoplayEl = document.getElementById('news-autoplay-setting');
const nameEl = document.getElementById('station-name');
const urlEl = document.getElementById('station-url');
const regionEl = document.getElementById('station-region');
const addBtn = document.getElementById('add-station');
const listEl = document.getElementById('station-list');

// ステーション描画
function renderStations() {
  listEl.innerHTML = '';
  (settings.stations || []).forEach(station => {
    const div = document.createElement('div');
    div.className = 'station';

    const info = document.createElement('div');
    info.innerHTML = `
      <strong>${station.name}</strong><br>
      <small>${station.region}</small><br>
      <code>${station.streamUrl}</code>
    `;

    const delBtn = document.createElement('button');
    delBtn.textContent = '削除';
    delBtn.addEventListener('click', () => {
      settings.stations = settings.stations.filter(s => s.id !== station.id);
      saveSettings(settings);
      renderStations();
    });

    div.appendChild(info);
    div.appendChild(delBtn);
    listEl.appendChild(div);
  });
}

// 初期化
liveAutoplayEl.checked = settings.liveAutoplay;
newsAutoplayEl.checked = settings.newsAutoplay;

liveAutoplayEl.addEventListener('change', (e) => {
  settings.liveAutoplay = e.target.checked;
  saveSettings(settings);
});

newsAutoplayEl.addEventListener('change', (e) => {
  settings.newsAutoplay = e.target.checked;
  saveSettings(settings);
});

// ステーション追加
addBtn.addEventListener('click', () => {
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
  saveSettings(settings);
  renderStations();

  nameEl.value = '';
  urlEl.value = '';
  regionEl.value = '';
});

renderStations();
