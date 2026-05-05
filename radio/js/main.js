// ---- LocalStorage Keys ----
const KEY_SETTINGS = "radio-settings";
const KEY_STATIONS = "radio-stations";

// ---- 設定を読み込む ----
function loadSettings() {
  return JSON.parse(localStorage.getItem(KEY_SETTINGS)) || {
    liveAutoplay: false,
    newsAutoplay: false
  };
}

// ---- ステーション一覧を読み込む ----
function loadStations() {
  return JSON.parse(localStorage.getItem(KEY_STATIONS)) || [];
}

// ---- メイン処理 ----
function initRadioPlayer() {
  const settings = loadSettings();
  const stations = loadStations();

  console.log("設定:", settings);
  console.log("ステーション一覧:", stations);

  // ▼ ライブ自動再生
  if (settings.liveAutoplay) {
    playLiveStream();
  }

  // ▼ ニュース自動再生
  if (settings.newsAutoplay) {
    playLatestNews();
  }

  // ▼ ステーション一覧を UI に反映
  renderStationButtons(stations);
}

// ---- ライブ再生（あなたの既存コードに合わせて実装） ----
function playLiveStream() {
  console.log("ライブ自動再生を開始");
  // audio.src = "ライブURL";
  // audio.play();
}

// ---- ニュース再生（あなたの既存ニュース再生ロジックに接続） ----
function playLatestNews() {
  console.log("ニュース自動再生を開始");
  // fetch → XML → 最新ニュース → audio.src → play();
}

// ---- ステーション一覧をボタン化して表示 ----
function renderStationButtons(stations) {
  const container = document.getElementById("station-buttons");
  if (!container) return;

  container.innerHTML = "";

  stations.forEach(st => {
    const btn = document.createElement("button");
    btn.className = "station-btn";
    btn.textContent = `${st.name}（${st.region}）`;

    btn.addEventListener("click", () => {
      console.log("再生:", st.url);
      // audio.src = st.url;
      // audio.play();
    });

    container.appendChild(btn);
  });
}

// ---- 初期化 ----
initRadioPlayer();
