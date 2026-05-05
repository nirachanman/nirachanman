// settings.js

// ---- LocalStorage Keys ----
const KEY_SETTINGS = "radio-settings";
const KEY_STATIONS = "radio-stations";

// ---- Elements ----
const liveAutoplay = document.getElementById("live-autoplay");
const newsAutoplay = document.getElementById("news-autoplay");
const stationName = document.getElementById("station-name");
const stationUrl = document.getElementById("station-url");
const stationRegion = document.getElementById("station-region");
const addStationBtn = document.getElementById("add-station");
const stationList = document.getElementById("station-list");

// ---- Load Settings ----
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem(KEY_SETTINGS)) || {
    liveAutoplay: false,
    newsAutoplay: false
  };

  liveAutoplay.checked = settings.liveAutoplay;
  newsAutoplay.checked = settings.newsAutoplay;
}

// ---- Save Settings ----
function saveSettings() {
  const settings = {
    liveAutoplay: liveAutoplay.checked,
    newsAutoplay: newsAutoplay.checked
  };
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
}

// ---- Load Stations ----
function loadStations() {
  return JSON.parse(localStorage.getItem(KEY_STATIONS)) || [];
}

// ---- Save Stations ----
function saveStations(stations) {
  localStorage.setItem(KEY_STATIONS, JSON.stringify(stations));
}

// ---- Render Station List ----
function renderStationList() {
  const stations = loadStations();
  stationList.innerHTML = "";

  stations.forEach((st, index) => {
    const div = document.createElement("div");
    div.className = "station-item";
    div.innerHTML = `
      <strong>${st.name}</strong> (${st.region})<br>
      <small>${st.url}</small>
      <button data-index="${index}" class="delete-btn">削除</button>
    `;
    stationList.appendChild(div);
  });

  // 削除ボタンのイベント
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = e.target.dataset.index;
      const stations = loadStations();
      stations.splice(idx, 1);
      saveStations(stations);
      renderStationList();
    });
  });
}

// ---- Add Station ----
addStationBtn.addEventListener("click", () => {
  const name = stationName.value.trim();
  const url = stationUrl.value.trim();
  const region = stationRegion.value.trim();

  if (!name || !url) {
    alert("表示名とURLは必須です");
    return;
  }

  const stations = loadStations();
  stations.push({ name, url, region });
  saveStations(stations);

  stationName.value = "";
  stationUrl.value = "";
  stationRegion.value = "";

  renderStationList();
});

// ---- Save settings on change ----
liveAutoplay.addEventListener("change", saveSettings);
newsAutoplay.addEventListener("change", saveSettings);

// ---- Initialize ----
loadSettings();
renderStationList();
