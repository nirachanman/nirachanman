let audio = null;
let currentIndex = null;
let settings = null;

const listEl = document.getElementById('news-list');
const playBtn = document.getElementById('news-play');
const stopBtn = document.getElementById('news-stop');
const prevBtn = document.getElementById('news-prev');
const nextBtn = document.getElementById('news-next');

function render() {
  listEl.innerHTML = '';
  (settings.newsList || []).forEach((item, i) => {
    const li = document.createElement('li');
    li.setAttribute('data-i', i);

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `<div class="station-name">${item.title}</div>`;

    const controls = document.createElement('div');
    controls.className = 'controls';

    const dlBtn = document.createElement('a');
    dlBtn.className = 'icon-btn';
    dlBtn.textContent = '📥';
    dlBtn.href = item.audioUrl;
    dlBtn.download = '';
    dlBtn.title = '音声をダウンロード';

    controls.appendChild(dlBtn);
    li.appendChild(meta);
    li.appendChild(controls);
    listEl.appendChild(li);
  });
}

function playNews(index) {
  const item = settings.newsList?.[index];
  if (!item) return;

  stop();

  audio = document.createElement('audio');
  audio.src = item.audioUrl;
  audio.autoplay = true;
  audio.controls = false;
  audio.crossOrigin = 'anonymous';
  audio.style.display = 'none';
  document.body.appendChild(audio);

  audio.addEventListener('loadedmetadata', () => {
    audio.play().catch(() => {});
  });

  currentIndex = index;
  updateHighlight(index);
}

function stop() {
  if (audio) {
    audio.pause();
    audio.src = '';
    audio.remove();
    audio = null;
  }
  updateHighlight(null);
  currentIndex = null;
}

function updateHighlight(index) {
  listEl.querySelectorAll('li').forEach(li => {
    const i = parseInt(li.getAttribute('data-i'));
    li.classList.toggle('playing', i === index);
  });
}

function wireControls() {
  playBtn.addEventListener('click', () => {
    if (currentIndex != null) {
      playNews(currentIndex);
    } else if (settings.newsList?.[0]) {
      playNews(0);
    }
  });

  stopBtn.addEventListener('click', stop);

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) playNews(currentIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < settings.newsList.length - 1) {
      playNews(currentIndex + 1);
    }
  });
}

function init(s) {
  settings = s;
  render();
  wireControls();

  if (settings.newsAutoplay && settings.newsList?.[0]) {
    playNews(0);
  }
}

export const NewsPlaylist = { init };
