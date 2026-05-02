let items = [];
let index = 0;

async function fetchFeed() {
  const feedUrl = 'https://www.nhk.or.jp/s-media/news/podcast/list/v1/all.xml';
  try {
    const res = await fetch(feedUrl);
    const xml = await res.text();
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const entries = [...doc.querySelectorAll('item')];
    items = entries.map(e => ({
      title: e.querySelector('title').textContent,
      url: e.querySelector('enclosure').getAttribute('url')
    }));
    playCurrent();
  } catch (e) {
    alert('NHKラジオニュースの取得に失敗しました');
  }
}

function playCurrent() {
  const audio = document.getElementById('audio');
  const title = document.getElementById('title');
  audio.src = items[index].url;
  title.textContent = items[index].title;
  audio.play();
  updateList();
}

function updateList() {
  const list = document.getElementById('list');
  list.innerHTML = '';
  items.forEach((item, i) => {
    const div = document.createElement('div');
    div.textContent = (i === index ? '▶ ' : '') + item.title;
    div.className = i === index ? 'active' : '';
    div.onclick = () => {
      index = i;
      playCurrent();
    };
    list.appendChild(div);
  });
}

document.getElementById('prev').onclick = () => {
  if (index > 0) {
    index--;
    playCurrent();
  } else {
    alert('最初のニュースです');
  }
};

document.getElementById('next').onclick = () => {
  if (index < items.length - 1) {
    index++;
    playCurrent();
  } else {
    alert('最後のニュースです');
  }
};

document.getElementById('audio').onended = () => {
  if (index < items.length - 1) {
    index++;
    playCurrent();
  } else {
    alert('すべてのニュースの再生が完了しました');
  }
};

document.getElementById('refreshList').onclick = async () => {
  await fetchFeed();       // RSS再取得
  playCurrent();           // 現在の再生を維持
};

document.getElementById('liveButton').onclick = () => {
  window.open('https://www.nhk.or.jp/radio/player/?ch=1', '_blank');
};

fetchFeed();
