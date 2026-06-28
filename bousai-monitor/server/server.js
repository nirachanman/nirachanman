const {
  startJMA
} = require("./jma");

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT =
  process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date()
  });
});

/*
  jma.js から呼び出される
*/
global.broadcast = function (
  type,
  data
) {
  console.log(
    `[Broadcast] ${type}`
  );

  io.emit(
    type,
    data
  );
};

io.on("connection", (socket) => {

  console.log(
    "接続:",
    socket.id
  );

  socket.emit("system", {
    message:
      "防災サーバー接続成功"
  });

  /*
    動作確認用
    接続5秒後にEEWテスト配信
  */
   /*
  setTimeout(() => {

    socket.emit(
      "eew",
      {
        title:
          "緊急地震速報（テスト）",
        updated:
          new Date()
            .toISOString(),
        link: ""
      }
    );

  }, 5000);
   */
  socket.on(
    "disconnect",
    () => {
      console.log(
        "切断:",
        socket.id
      );
    }
  );
});

server.listen(PORT, () => {

  console.log(
    `防災サーバー起動 http://localhost:${PORT}`
  );

  try {
    startJMA();
  } catch (err) {
    console.error(
      "JMA監視起動失敗:",
      err
    );
  }
});