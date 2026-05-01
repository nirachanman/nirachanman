const feedUrl = 'https://www.nhk.or.jp/s-media/news/podcast/list/v1/all.xml';
let items = [], index = 0;

const audio = document.getElementById('audio');
const title = document.getElementById('title');
const list = document.getElementById('list');
const autoPlayCheckbox = document.getElementById('autoPlay');

document.getElementById('prev').onclick = () => {
  if (index > 0) index--;
  playCurrent();
};

document.getElementById('next').onclick = () => {
  if (index < items.length - 1) index++;
  playCurrent();
};

document.getElementById('minimize').onclick = () => {
  document.getElementById('body').style.display =
    document.getElementById('body').style.display === 'none' ? '' : 'none';
};

document.getElementById('close').onclick = () => {
  document.getElementById('player').remove();
};

audio.onended = () => {
  if (autoPlayCheckbox.checked && index < items.length - 1) {
    index++;
    playCurrent();
  }
};

autoPlayCheckbox.onchange = () => {
  chrome.storage.local.set({ autoPlay: autoPlayCheckbox.checked });
};

chrome.storage.local.get('autoPlay', data => {
  autoPlayCheckbox.checked = data.autoPlay || false;
});

function fetchFeed() {
  fetch(feedUrl)
    .then(res => res.text())
    .then(xml => {
      const doc = new DOMParser().parseFromString(xml, 'text/xml');
      const entries = [...doc.querySelectorAll('item')];
      items = entries.map(e => {
        const enclosure = e.querySelector('enclosure');
        return {
          title: e.querySelector('title')?.textContent || 'タイトルなし',
          url: enclosure?.getAttribute('url') || ''
        };
      }).filter(item => item.url);
      if (items.length === 0) {
        title.textContent = '再生可能なニュースがありません';
        return;
      }
      index = 0;
      title.textContent = items[index].title;
      renderList();
      // audio.src は設定しない → 再生されない
    })
    .catch(err => {
      console.error('Feed取得失敗:', err);
      title.textContent = '取得に失敗しました';
    });
}

function playCurrent() {
  audio.src = items[index].url;
  title.textContent = items[index].title;
  audio.play();
  renderList();
}

function renderList() {
  list.innerHTML = '';
  items.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = i === index ? 'active' : '';

    // 再生ボタンとタイトルを分離して構築
    div.innerHTML = `
      <button class="play-button">再生</button>
      <span class="title-text">${item.title}</span>
    `;

    // 再生ボタンのクリックでその項目を再生
    div.querySelector('.play-button').onclick = () => {
      index = i;
      playCurrent();
    };

    list.appendChild(div);
  });
}

fetchFeed();
