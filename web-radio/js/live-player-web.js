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

    // 左側：再生・停止ボタン
    const controls = document.createElement('div');
    controls.className = 'station-controls';

    const playBtn = document.createElement('button');
    playBtn.className = 'play-btn';
    playBtn.textContent = '▶';
    playBtn.addEventListener('click', () => playStation(s));

    const stopBtn = document.createElement('button');
    stopBtn.className = 'stop-btn';
    stopBtn.textContent = '■';
    stopBtn.addEventListener('click', stop);

    controls.appendChild(playBtn);
    controls.appendChild(stopBtn);

    // 右側：局名・地域
    const meta = document.createElement('div');
    meta.className = 'station-meta';
    meta.innerHTML = `
      <div class="station-name">${s.name}</div>
      <div class="station-sub">${s.region}</div>
    `;

    li.appendChild(controls);
    li.appendChild(meta);
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

  nowEl.textContent = `${station.name} 読み込み中…`;

  audio = document.createElement('audio');
  audio.controls = false;
  audio.autoplay = true;
  audio.crossOrigin = 'anonymous';
  audio.style.display = 'none';
  document.body.appendChild(audio);

  if (station.streamUrl.endsWith('.mp3')) {
    audio.src = station.streamUrl;
    audio.addEventListener('loadedmetadata', () => {
      audio.play().catch(() => {
        nowEl.textContent = `再生できません（操作が必要）`;
      });
    });
  } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
    audio.src = station.streamUrl;
    audio.addEventListener('loadedmetadata', () => {
      audio.play().catch(() => {
        nowEl.textContent = `再生できません（操作が必要）`;
      });
    });
  } else if (window.Hls && window.Hls.isSupported()) {
    hls = new window.Hls();
    hls.loadSource(station.streamUrl);
    hls.attachMedia(audio);
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
      audio.play().catch(() => {
        nowEl.textContent = `再生できません（操作が必要）`;
      });
    });
  } else {
    nowEl.textContent = `この形式は再生できません`;
    return;
  }

  current = station;
  nowEl.textContent = `${station.name} 再生中`;
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
  nowEl.textContent = '停止中';
  current = null;
  updateButtonStates(null);
}

function wireControls() {
  playBtn.addEventListener('click', async () => {
    if (current && audio) {
      await audio.play().catch(() => {});
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
}

export const LivePlayer = { init };
