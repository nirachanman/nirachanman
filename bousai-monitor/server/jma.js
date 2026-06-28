const axios = require("axios");
const xml2js = require("xml2js");

const parser = new xml2js.Parser();

const FEEDS = {
  earthquake:
    "https://www.data.jma.go.jp/developer/xml/feed/eqvol.xml",

  regular:
    "https://www.data.jma.go.jp/developer/xml/feed/regular.xml"
};

const sentIds = new Set();
const sentLinks = new Set();
const startupTitles = new Set();
const detailCache = new Map();

let initialized = false;

async function loadFeed(url) {
  try {
    console.log("取得開始:", url);

    const res = await axios.get(url, {
      timeout: 10000
    });

    console.log("取得成功:", url);

    return await parser.parseStringPromise(
      res.data
    );

  } catch (err) {
    console.error("取得失敗:", url);
    console.error(err.message);
    return null;
  }
}

function getText(v) {
  if (!v) return "";
  if (Array.isArray(v)) return v[0];
  return v;
}

/*
  気象警報・注意報の詳細XML取得
*/
async function getWarningDetail(url) {
  try {
    if (!url) {
      return "";
    }

    const res = await axios.get(url, {
      timeout: 10000
    });

    const xml =
      await parser.parseStringPromise(
        res.data
      );

    const body =
      xml.Report?.Body?.[0];

    if (!body?.Warning?.[0]?.Item) {
      return "";
    }

    const items =
      body.Warning[0].Item;

    let text = "";

    for (const item of items) {

      const area =
        item.Area?.[0]?.Name?.[0] ||
        "不明";

      const kind =
        item.Kind?.[0];

      if (!kind) {
        continue;
      }

      const name =
        kind.Name?.[0];

      const status =
        kind.Status?.[0];

      /*
        「発表警報・注意報はなし」は表示しない
      */
      if (
        status ===
        "発表警報・注意報はなし"
      ) {
        continue;
      }

      text += `【${area}】\n`;

      if (name) {
        text += `・${name}`;
      }

      if (status) {
        text += `（${status}）`;
      }

      text += "\n\n";
    }

    return text.trim();

  } catch (err) {

    console.error(
      "詳細XML取得失敗:",
      err.message
    );

    return "";
  }
}
async function processFeed(
  feedName,
  url
) {
  const xml =
    await loadFeed(url);

  if (
    !xml ||
    !xml.feed ||
    !xml.feed.entry
  ) {
    return;
  }

  const entries =
    xml.feed.entry;

  console.log(
    `[${feedName}] 件数:`,
    entries.length
  );

  for (const e of entries) {

    const id =
      getText(e.id);

    if (!id) {
      continue;
    }

    const title =
      getText(e.title);

    const updated =
      getText(e.updated);

    const link =
      e.link?.[0]?.$
        ?.href || "";

    /*
      起動後は既読をスキップ
    */
    if (
      initialized &&
      (
        sentIds.has(id) ||
        sentLinks.has(link)
      )
    ) {
      continue;
    }

    /*
      起動時は一覧表示のみ
    */
    if (!initialized) {

      if (
        !startupTitles.has(
          title
        )
      ) {

        startupTitles.add(
          title
        );

        console.log(
          `[JMA][起動時] ${updated} ${title}`
        );
      }

      sentIds.add(id);
      sentLinks.add(link);

      continue;
    }

    /*
      ここから新着処理
    */

    let detail = "";

    if (
      title.includes("気象警報") ||
      title.includes("注意報")
    ) {

      if (
        detailCache.has(link)
      ) {

        detail =
          detailCache.get(
            link
          );

      } else {

        detail =
          await getWarningDetail(
            link
          );

        detailCache.set(
          link,
          detail
        );
      }
    }

    const payload = {
      id,
      title,
      updated,
      link,
      detail
    };

    sentIds.add(id);
    sentLinks.add(link);

    console.log(
      `[JMA][新着] ${updated} ${title}`
    );

    if (
      typeof broadcast ===
      "function"
    ) {

      if (
        title.includes(
          "緊急地震速報"
        )
      ) {

        broadcast(
          "eew",
          payload
        );

      } else if (
        title.includes(
          "津波"
        )
      ) {

        broadcast(
          "tsunami",
          payload
        );

      } else {

        broadcast(
          "warning",
          payload
        );
      }
    }
  }
}

async function pollJMA() {

  console.log(
    "[JMA] フィード確認:",
    new Date()
      .toLocaleString()
  );

  await processFeed(
    "earthquake",
    FEEDS.earthquake
  );

  await processFeed(
    "regular",
    FEEDS.regular
  );

  initialized = true;
}

function startJMA() {

  console.log(
    "気象庁XML監視開始"
  );

  pollJMA();

  setInterval(
    pollJMA,
    10000
  );
}

module.exports = {
  startJMA
};