export async function fetchNHKNewsList() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'fetchNHKNews' }, (response) => {
      if (!response || !response.success) {
        console.error('Failed to fetch NHK news:', response?.error);
        resolve([]);
        return;
      }
      const parser = new DOMParser();
      const xml = parser.parseFromString(response.xml, 'application/xml');
      const items = Array.from(xml.querySelectorAll('item')).map(item => {
        const title = item.querySelector('title')?.textContent || '';
        const audioUrl = item.querySelector('enclosure')?.getAttribute('url') || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        const guid = item.querySelector('guid')?.textContent || '';
        return {
          id: guid,
          title,
          audioUrl,
          date: new Date(pubDate).toISOString()
        };
      });
      resolve(items);
    });
  });
}
