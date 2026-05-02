const selector = document.getElementById('channelSelector');
const player = document.getElementById('player');

let hlsInstance = null;

selector.addEventListener('change', function () {
  const url = this.value;

  // 前回の HLS インスタンスを破棄
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  // MP3 の場合は直接再生
  if (url.endsWith('.mp3')) {
    player.src = url;
    player.load();
    player.play();
    return;
  }

  // HLS（.m3u8）再生
  if (Hls.isSupported()) {
    hlsInstance = new Hls();
    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(player);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
      player.play();
    });
  } else if (player.canPlayType('application/vnd.apple.mpegurl')) {
    player.src = url;
    player.addEventListener('loadedmetadata', () => {
      player.play();
    });
  } else {
    alert("このブラウザはHLSに対応していません。");
  }
});
