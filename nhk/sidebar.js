const selector = document.getElementById('channelSelector');
const player = document.getElementById('player');

let hlsInstance = null;

selector.addEventListener('change', function () {
  const url = this.value;

  // 既存の HLS インスタンスを破棄
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }

  // MP3 の場合はネイティブ再生
  if (url.endsWith('.mp3')) {
    player.src = url;
    player.load();
    player.play();
    return;
  }

  // SmartStream 判定
  const isSmartStream = url.includes("smartstream.ne.jp");

  // Edge のネイティィブ HLS が使えるか
  const canNative = player.canPlayType("application/vnd.apple.mpegurl");

  // NHK などはネイティブ再生
  if (canNative && !isSmartStream) {
    player.src = url;
    player.play();
    return;
  }

  // --- hls.js 再生（SmartStream は必ずこちら）---
  hlsInstance = new Hls({
    enableWorker: true,
    lowLatencyMode: true,
    backBufferLength: 90,
    fragLoadingRetryDelay: 500,
    manifestLoadingRetryDelay: 500,
    maxBufferLength: 30,
    maxMaxBufferLength: 60
  });

  hlsInstance.loadSource(url);
  hlsInstance.attachMedia(player);

  hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
    player.play();
  });

  // SmartStream の fatal error を自動復旧
  hlsInstance.on(Hls.Events.ERROR, (event, data) => {
    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          hlsInstance.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hlsInstance.recoverMediaError();
          break;
        default:
          hlsInstance.destroy();
          break;
      }
    }
  });
});
