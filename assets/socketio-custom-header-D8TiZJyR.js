var e=`---
title: Socket.IO 自行增加 Header：Server CORS 與 Client extraHeaders 設定
description: 說明 Socket.IO 如何在 server 設定 CORS header，並在 Node.js client 用 extraHeaders 帶自訂 Origin。
date: 2020-03-13
category: 後端開發
tags: [Socket.IO, WebSocket, CORS, Node.js]
readingTime: 6 分鐘
image: /images/tech/hero_socketio-probe-websocket-failed.webp
imageAlt: Socket.IO WebSocket upgrade 與負載平衡分流示意圖
---


# Socket.IO 自行增加 Header：Server CORS 與 Client extraHeaders 設定

Socket.IO 要自行增加 header，server 端通常要先處理 CORS 與 preflight 回應，Node.js client 則可用 \`extraHeaders\` 帶入自訂 header。若 client 跑在瀏覽器，而且只啟用 WebSocket transport，瀏覽器 WebSocket API 不允許任意設定自訂 header，因此 \`extraHeaders\` 會被忽略。

## Socket.IO 自行增加 Header 要先分清楚 server 與 client

Socket.IO 自訂 header 分成兩個方向：server 回應瀏覽器跨來源請求的 CORS header，以及 client 連線時送到 server 的 request header。兩者設定位置不同，不能混在同一段程式碼判斷。

我當時的筆記把問題拆成「伺服器端」與「socket io client」兩段，這個拆法是對的。實作時可以先問兩件事：

| 問題 | 應該處理的位置 |
|---|---|
| 瀏覽器因 CORS 被擋，要允許來源、header 或 credentials | Socket.IO server 的 CORS 設定 |
| Node.js client 要在握手或 polling request 帶自訂 header | Socket.IO client 的 \`extraHeaders\` |
| 瀏覽器 client 要帶 cookie | 同源 cookie、CORS \`credentials\` 與 \`withCredentials\` |
| 瀏覽器 WebSocket 要帶任意自訂 header | 通常不可行，需改用 query、auth 或 cookie |

Socket.IO v4 官方文件說明，\`extraHeaders\` 會出現在 server 端的 \`socket.handshake.headers\`；但瀏覽器只用 WebSocket transport 時，因 WebSocket API 限制，\`extraHeaders\` 會被忽略（Socket.IO Docs，Client options，存取日期 2026-08-28）。

## 伺服器端如何回應 CORS header？

Socket.IO server 若要允許跨來源連線，應明確設定允許的 origin、headers 與 credentials。Socket.IO v3 之後需要顯式啟用 CORS，不建議在正式環境直接放開所有來源。

當時的伺服器端範例程式碼如下：

\`\`\`js
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const sio = require("socket.io")(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});

sio.on("connection", () => {
    console.log("Connected!");
});

server.listen(3000);
\`\`\`

如果是 Socket.IO v4，比較建議改成 \`cors\` 選項，並列出允許的來源與 header：

\`\`\`js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["https://example.com"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});
\`\`\`

Socket.IO 官方文件提醒，啟用 \`credentials: true\` 時不能搭配 \`origin: "*"\`，否則瀏覽器會因 CORS credentials 規則拒絕請求（Socket.IO Docs，Server options，存取日期 2026-08-28）。

## \`origins: '*:*'\` 與 \`io.set('origins')\` 還適合使用嗎？

\`origins: '*:*'\` 與 \`io.set('origins', '*:*')\` 屬於舊版 Socket.IO 常見寫法。整理舊專案時可以保留作為遷移線索，但新專案應優先使用 v4 的 \`cors.origin\`。

我當時的筆記保留的兩種寫法如下：

\`\`\`js
var io = require('socket.io')(server, { origins: '*:*'});
\`\`\`

或者：

\`\`\`js
io.set('origins', '*:*');
\`\`\`

如果只是本機測試，放開 origin 可以快速排除 CORS 問題；如果是正式環境，建議改成白名單。Socket.IO v4 的 server options 文件也特別標示選項名稱是 \`origin\`，不是 \`origins\`，即使允許多個網域也一樣使用 \`origin: [...]\`。

## Node.js Socket.IO client 如何用 extraHeaders？

Node.js Socket.IO client 可以用 \`extraHeaders\` 送出自訂 request header。這個方法適合後端服務、CLI 工具、React Native 或測試程式，不適合拿來突破瀏覽器安全限制。

當時的 socket io client 範例保留如下：

\`\`\`js
const socket = require('socket.io-client')(host,{
  forceNode:true,
  transports: ['websocket'],
  extraHeaders: {
      Origin: Origindata
  },
  transportOptions: {
    polling: {
      extraHeaders: {
        Origin: Origindata
      }
    }
  }
});
\`\`\`

這段程式的重點有兩個：

1. \`extraHeaders\` 會套用在底層連線請求。
2. \`transportOptions.polling.extraHeaders\` 可以只針對 polling transport 設定 header。

若需要跨站攜帶 cookie，Socket.IO v4 client 另有 \`withCredentials: true\`；官方文件也註明，從 Socket.IO v4.7.0 開始，Node.js client 設定 \`withCredentials\` 後會在 HTTP request 中包含 cookies，較容易搭配 cookie-based sticky session（Socket.IO Docs，Client options，存取日期 2026-08-28）。

## 瀏覽器端為什麼不能任意加 WebSocket header？

瀏覽器端 Socket.IO client 不能把 \`extraHeaders\` 當成萬用解法。當瀏覽器只啟用 \`transports: ['websocket']\` 時，WebSocket API 不開放自訂 request headers。

如果前端需要傳遞身份或來源資訊，可以改用這些方式：

| 需求 | 建議做法 |
|---|---|
| 傳遞登入狀態 | 使用 cookie 搭配 \`withCredentials\` 與 server \`credentials: true\` |
| 傳遞 token | 使用 Socket.IO \`auth\` 或安全的短期 token |
| 傳遞非敏感參數 | 使用 \`query\`，但不要放機密資訊 |
| 控制可連線來源 | 在 server 設定 CORS \`origin\` 或 \`allowRequest\` |

資訊增益：如果問題是在瀏覽器連線失敗，不要只照 Node.js client 範例加 \`extraHeaders\`。先打開瀏覽器 Network 面板，確認實際 request 是否是 polling 還是 websocket，再看 header 是否真的送出。

## 常見問題

Socket.IO 自訂 header 常見問題多半卡在執行環境差異：Node.js client 可以加 header，瀏覽器 client 則受 WebSocket API 與 CORS 規則限制。先確認環境，再選設定方式。

### Socket.IO client 的 \`extraHeaders\` 在瀏覽器可以用嗎？
Socket.IO client 的 \`extraHeaders\` 在瀏覽器不是完整可用。若瀏覽器只使用 WebSocket transport，自訂 header 會被忽略；Node.js、React Native 等非瀏覽器環境才適合用 \`extraHeaders\`。

### Socket.IO v4 要怎麼設定允許跨來源？
Socket.IO v4 建議在 server 使用 \`cors\` 選項，例如 \`origin\`、\`allowedHeaders\` 與 \`credentials\`。如果需要帶 cookie，不可以把 \`origin\` 設成 \`"*"\`。

### \`Access-Control-Allow-Origin\` 可以直接回傳 request origin 嗎？
技術上可以，但正式環境應先檢查 request origin 是否在白名單內。直接反射所有來源等於降低 CORS 保護，適合臨時除錯，不適合長期上線。

### \`transports: ['websocket']\` 會影響 header 嗎？
會。瀏覽器 WebSocket API 不允許設定任意自訂 header，所以只用 \`websocket\` 時，瀏覽器端的 \`extraHeaders\` 會被忽略；Node.js client 不受同樣限制。

### 要傳 token 給 Socket.IO server，應該用 header、query 還是 auth？
瀏覽器應優先考慮 Socket.IO \`auth\` 或 cookie；非敏感資料可用 \`query\`。Node.js client 才適合用 \`extraHeaders\` 傳 header，機密 token 仍要注意 log、proxy 與錯誤追蹤系統是否會外洩。

## 參考資料

本文參考 Socket.IO v4 官方文件與當時的 WordPress 匯出稿。外部來源皆為 HTTPS，並以 2026-08-28 存取內容為準。

- Socket.IO Docs：[Client options](https://socket.io/docs/v4/client-options/)
- Socket.IO Docs：[Handling CORS](https://socket.io/docs/v4/handling-cors/)
- Socket.IO Docs：[Server options](https://socket.io/docs/v4/server-options/)
- Socket.IO Docs：[Using multiple nodes](https://socket.io/docs/v4/using-multiple-nodes/)
- 我當時的匯出稿：\`markdown-export/Socket.io自行增加header.md\`

## 延伸閱讀

- [Socket.IO probe transport websocket failed：原因與 Cookie 分流解法](/post/socketio-probe-websocket-failed)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。
- [Socket.IO 錯誤訊息意義：ping timeout、transport close 與 disconnect](/post/socketio-error-messages)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。
- [Socket.io 是什麼？即時通信庫特性整理、範例與 nginx 配置要點](/post/socket-io-introduction)：同樣聚焦 WebSocket、Node.js，可接著比較不同情境的做法。

## 關於作者

Claire Chang（張可佳）是企業 AI 導入與流程轉型顧問，具備 19 年軟體工程經驗。技術背景包含前端、後端、影像辨識與 Kubernetes 系統維運。

## 最後更新

本文最後更新於 2026-08-28。我當時的筆記發布於 2020-03-13，這次整理保留當時的 Socket.IO server 與 client 程式碼，並補上 Socket.IO v4 的 CORS、\`extraHeaders\` 與瀏覽器限制說明。
`;export{e as default};