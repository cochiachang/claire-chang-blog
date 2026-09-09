var e=`---
title: Socket.IO websocket failed：原因與 Cookie 分流解法
description: 說明 Socket.IO 出現 probe transport websocket failed 的原因，包含 polling 升級 websocket、LTM 分流、sticky session 與 extraHeaders 設定。
date: 2020-03-13
category: 後端開發
tags: [Socket.IO, WebSocket, Engine.IO]
readingTime: 7 分鐘
image: /images/tech/hero_socketio-probe-websocket-failed.webp
imageAlt: Socket.IO WebSocket upgrade 與負載平衡分流示意圖
---
# Socket.IO probe transport websocket failed：原因與 Cookie 分流解法

\`probe transport websocket failed\` 通常表示 Socket.IO 從 polling 升級到 WebSocket 時失敗。若伺服器前方有負載平衡器，最常見原因是握手與升級請求被分到不同後端，導致 session 或 cookie 對不上。

## Socket.IO 為什麼會出現 probe transport websocket failed？

Socket.IO 底層使用 Engine.IO，預設會先用 HTTP long polling 建立連線，再嘗試升級成 WebSocket。\`probe transport websocket failed\` 代表升級探測失敗，但原始 polling 連線不一定立刻失效。

常見原因：

| 原因 | 說明 |
| --- | --- |
| 負載平衡未黏住 session | polling 到 A server，WebSocket upgrade 到 B server |
| Proxy 未支援 upgrade header | Nginx 或 L7 proxy 沒轉發 \`Upgrade\` |
| CORS 或 header 不一致 | 握手與升級請求權限不同 |
| Client 或 server transport 設定不一致 | 一端只允許 websocket，另一端仍期待 polling |
| 網路環境阻擋 WebSocket | 公司網路、舊代理或防火牆阻擋 |

## Engine.IO 哪些參數和連線升級有關？

Engine.IO 的 \`transports\`、\`allowUpgrades\` 與 \`upgradeTimeout\` 會直接影響 polling 到 WebSocket 的升級流程。\`pingTimeout\` 與 \`pingInterval\` 則影響連線存活判定。

相關參數：

| 參數 | 意義 |
| --- | --- |
| \`transports\` | 允許的 transport，例如 \`['polling', 'websocket']\` |
| \`allowUpgrades\` | 是否允許從 polling 升級 |
| \`upgradeTimeout\` | 升級未完成前等待多久 |
| \`pingTimeout\` | 多久沒收到 pong 視為斷線 |
| \`pingInterval\` | 送出 ping 的間隔 |
| \`cookie\` | 是否設定 client sid cookie |
| \`cors\` | CORS 設定 |

只把 client 設為 \`transports: ['websocket']\` 可以跳過 polling，但會改變原本握手行為。若環境仍有不支援 WebSocket 的瀏覽器或代理，這種做法可能讓連線直接失敗。

## 負載平衡器為什麼會造成 WebSocket probe 失敗？

負載平衡器若用 Cookie 做 sticky session，Node.js client 預設不一定會保存並回送 Cookie。第一次 polling 握手可能到 A server，WebSocket upgrade 沒帶 Cookie 時被分到 B server，B server 找不到對應 session 就會失敗。

原文遇到的架構是 LTM 會在第一次請求未帶 cookie 時回 \`Set-Cookie\`，後續請求帶 cookie 才會導到同一台 server。問題點在於 client 沒有把 cookie 帶到升級請求。

可能看到的錯誤：

\`\`\`text
probe transport "websocket" failed because of error: Error: websocket error
\`\`\`

資訊增益：這類問題不要只看 Socket.IO client log。要同時比對負載平衡器 log、A/B server 的 Engine.IO session id，以及 WebSocket upgrade request 是否帶到相同 cookie。

## 如何用 extraHeaders 帶 Cookie 解決？

Node.js Socket.IO client 可以用 \`extraHeaders\` 在連線時帶入 Cookie。這能讓 polling 與 WebSocket upgrade 經過負載平衡器時被導到同一台後端。

連線時加 Cookie：

\`\`\`js
const manager = new io.Manager(config.host, {
  reconnection: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  extraHeaders: {
    Cookie: cookies,
  },
});
\`\`\`

若只需要 polling transport 加 header：

\`\`\`js
manager.opts.transportOptions = {
  polling: {
    extraHeaders: {
      Cookie: cookies,
    },
  },
};
\`\`\`

瀏覽器端 Socket.IO client 不能任意設定某些 forbidden headers，例如 \`Cookie\`。瀏覽器情境應改用同網域 cookie、CORS credentials、proxy sticky session 或 server-side session store。

## Nginx 反向代理 WebSocket 要設定什麼？

Nginx 代理 Socket.IO 時必須正確轉發 WebSocket upgrade header。若少了 \`Upgrade\` 與 \`Connection\`，WebSocket 升級會被當成一般 HTTP request。

常見設定：

\`\`\`nginx
location /socket.io/ {
    proxy_pass http://socketio_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
\`\`\`

若有多台後端，還要確認 sticky session 或共用 adapter，例如 Redis adapter，是否符合應用架構。

## 常見問題

### \`probe transport websocket failed\` 一定代表 WebSocket 完全不能用嗎？

不一定。Socket.IO 可能仍維持 polling 連線，只是升級 WebSocket 失敗。是否影響功能要看應用是否允許 polling fallback。

### 可以直接設定只用 \`websocket\` 嗎？

可以，但要確認所有 client 與網路環境都支援 WebSocket。只用 websocket 會跳過 polling fallback。

### 瀏覽器端可以用 \`extraHeaders.Cookie\` 嗎？

通常不可以。瀏覽器限制部分 header，Cookie 應透過瀏覽器 cookie、credentials 與同源策略處理。

### 負載平衡器需要 sticky session 嗎？

Socket.IO 多後端部署通常需要 sticky session，或需要讓後端共享連線狀態。否則 polling 與 upgrade 可能落到不同 server。

### 如何確認錯誤和 LTM 分流有關？

比對同一個 Engine.IO session 的 polling 與 websocket upgrade 是否進入同一台後端。若分別落到不同 server，問題多半在 sticky session 或 cookie。

## 參考資料

- Socket.IO Docs：[Using multiple nodes](https://socket.io/docs/v4/using-multiple-nodes/)
- Socket.IO Docs：[Client options](https://socket.io/docs/v4/client-options/)
- Engine.IO Protocol：[Protocol](https://socket.io/docs/v4/engine-io-protocol/)
- Stack Overflow：[Socket.io 1.x: use WebSockets only?](https://stackoverflow.com/questions/28238628/socket-io-1-x-use-websockets-only/28240802#28240802)

## 延伸閱讀

- [Engine.io 介紹](/post/engine-io-introduction)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。
- [Socket.IO 自行增加 Header：Server CORS 與 Client extraHeaders 設定](/post/socketio-custom-header)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。
- [Socket.IO 錯誤訊息意義：ping timeout、transport close 與 disconnect](/post/socketio-error-messages)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2020-03-13，本文補上負載平衡、瀏覽器 header 限制與 Nginx WebSocket proxy 檢查。

`;export{e as default};