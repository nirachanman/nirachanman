import { LivePlayer } from './live-player-web.js';

const DEFAULTS = {
  liveAutoplay: false,
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
    },
    {
      id: 'smooth',
      name: '101 Smooth Jazz',
      streamUrl: 'https://ais-sa2.cdnstream1.com/2606_128.mp3',
      region: 'US'
    },
    {
      id: 'jpop',
      name: 'J-Pop Sakura',
      streamUrl: 'https://ais-sa2.cdnstream1.com/2608_128.mp3',
      region: 'Japan'
    },
    {
      id: 'gold',
      name: 'Gold Instrumental',
      streamUrl: 'https://ais-sa2.cdnstream1.com/2605_128.mp3',
      region: 'US'
    }
  ]
};

let settings = null;

function loadSettings() {
  const raw = localStorage.getItem('nhk_radio_settings');
  return raw ? JSON.parse(raw) : DEFAULTS;
}

function saveSettings() {
  localStorage.setItem('nhk_radio_settings', JSON.stringify(settings));
}

(async function init() {
  settings = loadSettings();

  document.getElementById('live-autoplay-player').checked = settings.liveAutoplay;

  document.getElementById('live-autoplay-player').addEventListener('change', (e) => {
    settings.liveAutoplay = e.target.checked;
    saveSettings();
  });

  document.getElementById('settings-btn').addEventListener('click', () => {
    window.open('settings-web.html', '_blank');
  });

  LivePlayer.init(settings);
})();
