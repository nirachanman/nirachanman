import { fetchNHKNewsList } from './news-fetcher.js';
import { LivePlayer } from './live-player.js';
import { NewsPlaylist } from './news-playlist.js';

const DEFAULTS = {
  liveAutoplay: false,
  newsAutoplay: false,
  stations: [
    {
      id: 'r1',
      name: 'NHK R1',
      streamUrl: 'https://simul.drdi.st.nhk/live/8/joined/master.m3u8',
      region: '全国'
    },
    {
      id: 'fm',
      name: 'NHK FM',
      streamUrl: 'https://simul.drdi.st.nhk/live/9/joined/master.m3u8',
      region: '全国'
    }
  ],
  newsList: []
};

let settings = null;

// DOM
const tabs = {
  live: document.getElementById('tab-live'),
  news: document.getElementById('tab-news')
};
const panels = {
  live: document.getElementById('live-panel'),
  news: document.getElementById('news-panel')
};

// タブ切り替え
function showTab(tab) {
  tabs.live.classList.toggle('active', tab === 'live');
  tabs.news.classList.toggle('active', tab === 'news');
  panels.live.classList.toggle('hidden', tab !== 'live');
  panels.news.classList.toggle('hidden', tab !== 'news');
}

tabs.live.addEventListener('click', () => showTab('live'));
tabs.news.addEventListener('click', () => showTab('news'));

// 設定読み込み
async function loadSettings() {
  return new Promise(resolve => {
    chrome.storage.local.get(['nhk_radio_settings'], res => {
      resolve(res.nhk_radio_settings || DEFAULTS);
    });
  });
}

// 設定保存
async function saveSettings() {
  return new Promise(resolve => {
    chrome.storage.local.set({ nhk_radio_settings: settings }, () => resolve());
  });
}

// 初期化
(async function init() {
  settings = await loadSettings();

  // ニュース取得
  const newsItems = await fetchNHKNewsList();
  if (newsItems.length > 0) {
    settings.newsList = newsItems;
    await saveSettings();
  }

  // UI 初期化（ID 衝突解消済み）
  document.getElementById('live-autoplay-player').checked = !!settings.liveAutoplay;
  document.getElementById('news-autoplay-player').checked = !!settings.newsAutoplay;

  document.getElementById('live-autoplay-player').addEventListener('change', async (e) => {
    settings.liveAutoplay = e.target.checked;
    await saveSettings();
  });

  document.getElementById('news-autoplay-player').addEventListener('change', async (e) => {
    settings.newsAutoplay = e.target.checked;
    await saveSettings();
  });

  document.getElementById('settings-btn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
  });

  // プレイヤー初期化
  LivePlayer.init(settings);
  NewsPlaylist.init(settings);
})();
