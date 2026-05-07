import { fetchNHKNewsListWeb } from './news-fetcher-web.js';
import { LivePlayer } from './live-player-web.js';
import { NewsPlaylist } from './news-playlist-web.js';

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

// localStorage ラッパー
function loadSettings() {
  const raw = localStorage.getItem('nhk_radio_settings');
  return raw ? JSON.parse(raw) : DEFAULTS;
}

function saveSettings() {
  localStorage.setItem('nhk_radio_settings', JSON.stringify(settings));
}

// タブ切り替え
const tabs = {
  live: document.getElementById('tab-live'),
  news: document.getElementById('tab-news')
};
const panels = {
  live: document.getElementById('live-panel'),
  news: document.getElementById('news-panel')
};

function showTab(tab) {
  tabs.live.classList.toggle('active', tab === 'live');
  tabs.news.classList.toggle('active', tab === 'news');
  panels.live.classList.toggle('hidden', tab !== 'live');
  panels.news.classList.toggle('hidden', tab !== 'news');
}

tabs.live.addEventListener('click', () => showTab('live'));
tabs.news.addEventListener('click', () => showTab('news'));

// 初期化
(async function init() {
  settings = loadSettings();

  // ニュース取得（fetch 直接）
  const newsItems = await fetchNHKNewsListWeb();
  if (newsItems.length > 0) {
    settings.newsList = newsItems;
    saveSettings();
  }

  // UI 初期化
  document.getElementById('live-autoplay-player').checked = settings.liveAutoplay;
  document.getElementById('news-autoplay-player').checked = settings.newsAutoplay;

  document.getElementById('live-autoplay-player').addEventListener('change', (e) => {
    settings.liveAutoplay = e.target.checked;
    saveSettings();
  });

  document.getElementById('news-autoplay-player').addEventListener('change', (e) => {
    settings.newsAutoplay = e.target.checked;
    saveSettings();
  });

  document.getElementById('settings-btn').addEventListener('click', () => {
    window.open('settings-web.html', '_blank');
  });

  // プレイヤー初期化
  LivePlayer.init(settings);
  NewsPlaylist.init(settings);
})();
