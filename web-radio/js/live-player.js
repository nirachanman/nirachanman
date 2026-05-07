let stations = [];
let audio = null;
let hls = null;
let current = null;
let settings = null;

const listEl = document.getElementById('live-list');
const nowEl = document.getElementById('live-now');
const playBtn = document.getElementById('live-play');
const stopBtn = document.getElementById('live-stop');

function render() {
  listEl.innerHTML = '';
  stations.forEach(s => {
    const li = document.createElement('li');

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `
      <div class="station-name">${s.name}</div>
      <div class="station-sub">${s.region}</div>
    `;

    const controls = document.createElement('div');
    const btn = document.createElement('button');
    btn.className = 'icon-btn';
    btn.textContent = '▶';
    btn.setAttribute('data-id', s.id);
    btn.addEventListener('click', async () => {
      await playStation(s);
    });

    controls.appendChild(btn);
    li.appendChild(meta);
    li.appendChild(controls);
    listEl.appendChild(li);
  });
}

function updateButtonStates(activeId) {
  listEl.querySelectorAll('.icon-btn').forEach(btn => {
    const id = btn.getAttribute('data-id');
    if (id === activeId) {
      btn.textContent = '⏸';
      btn.classList.add('playing');
    } else {
      btn.textContent = '▶';
      btn.classList.remove('playing');
    }
  });
}

async function playStation(station) {
  stop();

  nowEl.textContent = `Loading ${station.name}...`;

  audio = document.createElement('audio');
  audio.controls = false;
  audio.autoplay = true;
  audio.crossOrigin = 'anonymous';
  audio.style.display = 'none';
  document.body.appendChild(audio);

  if (station.streamUrl.endsWith('.mp3') || station.streamUrl.includes('mp3')) {
    // ✅ MP3ストリームを直接再生
    audio.src = station.streamUrl;
    audio.addEventListener('loadedmetadata', () => {
      audio.play().catch(err => {
        nowEl.textContent = `再生できません（操作が必要）`;
        console.warn('Autoplay blocked:', err);
      });
    });
  } else if (window.Hls && window.Hls.isSupported()) {
    // ✅ HLS再生（.m3u8）
    hls = new window.Hls();
    hls.loadSource(station.streamUrl);
    hls.attachMedia(audio);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      audio.play().catch(err => {
        nowEl.textContent = `再生できません（操作が必要）`;
        console.warn('Autoplay blocked:', err);
      });
    });
  } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
    // ✅ SafariなどのネイティブHLS対応
    audio.src = station.streamUrl;
    audio.addEventListener('loadedmetadata', () => {
      audio.play().catch(err => {
        nowEl.textContent = `再生できません（操作が必要）`;
        console.warn('Autoplay blocked:', err);
      });
    });
  } else {
    nowEl.textContent = `この形式は再生できません`;
    return;
  }

  current = station;
  nowEl.textContent = `${station.name} Playing`;
  updateButtonStates(station.id);
}

function stop() {
  if (audio) {
    audio.pause();
    audio.src = '';
    audio.remove();
    audio = null;
  }
  if (hls) {
    hls.destroy();
    hls = null;
  }
  nowEl.textContent = 'Stopped';
  current = null;
  updateButtonStates(null);
}

function wireControls() {
  playBtn.addEventListener('click', async () => {
    if (current && audio) {
      try {
        await audio.play();
      } catch (e) {
        console.warn(e);
      }
    } else if (stations[0]) {
      await playStation(stations[0]);
    }
  });

  stopBtn.addEventListener('click', stop);
}

function init(s) {
  settings = s;
  stations = settings.stations || [];
  render();
  wireControls();

  if (settings.liveAutoplay && stations[0]) {
    playStation(stations[0]);
  }

  chrome.storage.onChanged.addListener(changes => {
    if (changes.nhk_radio_settings) {
      const newS = changes.nhk_radio_settings.newValue;
      settings = newS;
      stations = settings.stations || [];
      render();
      if (settings.liveAutoplay && stations[0]) {
        playStation(stations[0]);
      }
    }
  });
}

export const LivePlayer = {
  init
};
