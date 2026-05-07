// NHKニュース（Web版）
// Chrome拡張APIを使わず、fetch() だけで取得する

export async function fetchNHKNewsListWeb() {
  const url = 'https://www.nhk.or.jp/s-media/news/podcast/list/v1/all.xml';

  try {
    const res = await fetch(url);
    const text = await res.text();

    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    const items = Array.from(xml.querySelectorAll('item'));

    return items.map(item => ({
      title: item.querySelector('title')?.textContent || '',
      audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
      pubDate: item.querySelector('pubDate')?.textContent || ''
    })).filter(n => n.audioUrl);

  } catch (err) {
    console.warn('ニュース取得失敗（Web版）:', err);
    return [];
  }
}
