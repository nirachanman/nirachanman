const audio = document.getElementById('audio');
const title = document.getElementById('title');
const list = document.getElementById('list');
const autoNextCheckbox = document.getElementById('autoNextCheckbox');
let newsItems = [];
let currentIndex = 0;

async function fetchNews() {
  try {
    const res = await fetch('https://www.nhk.or.jp/s-media/news/podcast/list/v1/all.xml');
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    const items = xml.querySelectorAll('item');

    newsItems = Array.from(items).map(item => ({
      title: item.querySelector('title')?.textContent || 'タイトル不明',
      url: item.querySelector('enclosure')?.getAttribute('url') || ''
    }));

    renderList();
  } catch (e) {
    console.error('ニュース取得失敗:', e);
    list.innerHTML = '<p>ニュースの読み込みに失敗しました。</p>';
  }
}

function renderList() {
  list.innerHTML = '';
  newsItems.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.textContent = item.title;
    btn.onclick = () => {
      currentIndex = i;
      loadNews(i);
    };
    list.appendChild(btn);
  });
}

function loadNews(index) {
  const item = newsItems[index];
  if (!item) return;
  audio.src = item.url;
  title.textContent = item.title;
  audio.play();

  // ハイライト更新
  const buttons = list.querySelectorAll('button');
  buttons.forEach((btn, i) => {
    btn.classList.toggle('playing', i === index);
  });
}

document.getElementById('prev').onclick = () => {
  if (newsItems.length === 0) return;
  currentIndex = (currentIndex - 1 + newsItems.length) % newsItems.length;
  loadNews(currentIndex);
};

document.getElementById('next').onclick = () => {
  if (newsItems.length === 0) return;
  currentIndex = (currentIndex + 1) % newsItems.length;
  loadNews(currentIndex);
};

// ✅ 自動再生イベント
audio.addEventListener('ended', () => {
  if (autoNextCheckbox.checked && newsItems.length > 0) {
    currentIndex = (currentIndex + 1) % newsItems.length;
    loadNews(currentIndex);
  }
});

fetchNews();
