let audio = null;
let current = null;
let settings = null;

const listEl = document.getElementById('news-list');
const toggleBtn = document.getElementById('news-global-toggle');

function render() {
  listEl.innerHTML = '';
  (settings.newsList || []).forEach((item, i) => {
    const li = document.createElement('li');

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `
      <div class="station-name">${item.title}</div>
      <div class="station-sub">${item.pubDate}</div>
    `;

    const controls = document.createElement('div');

    // ▶ 再生ボタン
    const playBtn = document.createElement('button');
    playBtn.className = 'icon-btn';
    playBtn.textContent = '▶';
    playBtn.setAttribute('data-i', i);
    playBtn.addEventListener('click', () => playNews(item));

    // ■ 停止ボタン
    const stopBtn = document.createElement('button');
    stopBtn.className = 'icon-btn';
    stopBtn.textContent = '■';
    stopBtn.addEventListener('click', stop);

    controls.appendChild(playBtn);
    controls.appendChild(stopBtn);

    li.appendChild(meta);
    li.appendChild(controls);
    listEl.appendChild(li);
  });
}

function playNews(item) {
  stop();

  audio = document.createElement('audio');
  audio.src = item.audioUrl;
  audio.autoplay = true;
  audio.controls = false;
  audio.crossOrigin = 'anonymous';
  audio.style.display = 'none';
  document.body.appendChild(audio);

  audio.addEventListener('loadedmetadata', () => {
    audio.play().catch(err => {
      console.warn('Autoplay blocked:', err);
    });
  });

  current = item;
  updateButtonStates(item.audioUrl);
}

function stop() {
  if (audio) {
    audio.pause();
    audio.src = '';
    audio.remove();
    audio = null;
  }
  current = null;
  updateButtonStates(null);
}

function updateButtonStates(activeUrl) {
  listEl.querySelectorAll('.icon-btn[data-i]').forEach(btn => {
    const i = btn.getAttribute('data-i');
    const item = settings.newsList?.[i];
    if (item?.audioUrl === activeUrl) {
      btn.textContent = '⏸';
      btn.classList.add('playing');
    } else {
      btn.textContent = '▶';
      btn.classList.remove('playing');
    }
  });
}

function wireControls() {
  toggleBtn.addEventListener('click', () => {
    if (audio && !audio.paused) {
      stop();
    } else if (settings.newsList?.[0]) {
      playNews(settings.newsList[0]);
    }
  });
}

function init(s) {
  settings = s;
  render();
  wireControls();

  if (settings.newsAutoplay && settings.newsList?.[0]) {
    playNews(settings.newsList[0]);
  }

  chrome.storage.onChanged.addListener(changes => {
    if (changes.nhk_radio_settings) {
      const newS = changes.nhk_radio_settings.newValue;
      settings = newS;
      render();
      if (settings.newsAutoplay && settings.newsList?.[0]) {
        playNews(settings.newsList[0]);
      }
    }
  });
}

export const NewsPlaylist = {
  init
};
