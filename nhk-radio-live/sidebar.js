document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('channelSelector');
  const video = document.getElementById('player');

  const streams = {
  r1: 'https://simul.drdi.st.nhk/live/8/joined/master.m3u8',
  fm: 'https://simul.drdi.st.nhk/live/9/joined/master.m3u8',
  ラヂオもりおか: 'https://mtist.as.smartstream.ne.jp/30017/livestream/playlist.m3u8',
  カシオペアfm: 'http://mtist.as.smartstream.ne.jp/30050/livestream/playlist.m3u8',
  Befm: 'https://mtist.as.smartstream.ne.jp/30079/livestream/chunklist.m3u8',
  鹿角きりたんぽFM: 'http://mtist.as.smartstream.ne.jp/30089/livestream/playlist.m3u8',
  r1東京: 'https://simul.drdi.st.nhk/live/3/joined/master.m3u8',
  r2: 'https://simul.drdi.st.nhk/live/4/joined/master.m3u8',
  宝くじ: 'https://takarakuji-live.hls.wselive.stream.ne.jp/hls-live/2/takarakuji-live/live-high/chunklist.m3u8'

  };

  function playChannel(channel) {
    const url = streams[channel];

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.muted = true; // 自動再生対策
        video.play();
        setTimeout(() => video.muted = false, 500); // 音を戻す
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play();
    } else {
      alert('このブラウザでは再生できません');
    }
  }

  selector.onchange = () => {
    playChannel(selector.value);
  };

  playChannel('r1'); // 初期再生
});
