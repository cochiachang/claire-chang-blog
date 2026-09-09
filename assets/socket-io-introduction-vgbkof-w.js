var e=`---
title: Socket.io 是什麼？即時通信庫特性整理、範例與 nginx 配置要點
description: Socket.io 是基於 WebSocket 的 Client-Server 即時通信庫，支援事件、房間、Namespace、ACK 回調與自動重連。本文整理其核心特性、簡單範例，以及搭配 nginx 時必加的 Upgrade 與 ip_hash 配置。
date: 2020-03-13
category: 後端開發
tags: [Socket.IO, WebSocket, Node.js, Nginx, 即時通訊]
readingTime: 5 分鐘
image: /images/tech/hero_socket-io-introduction.webp
imageAlt: Socket.io 即時通信庫架構示意圖
---


# Socket.io 是什麼？即時通信庫特性整理、範例與 nginx 配置要點

這篇文章解決「要做即時通信功能，Socket.io 提供了什麼、要注意什麼」的問題。我會整理 Socket.io 的核心特性（事件、房間、Namespace、ACK 回調、心跳重連），附上一段簡單的推播範例，並說明搭配 nginx 反向代理時必加的配置與根命名空間的行為。

## Socket.io 的核心概念是什麼？

Socket.io 是基於 WebSocket 的 Client-Server 實時通信庫。

Socket.io 承繼了 Node.js 的事件處理方法，把 Client 端與 Server 端的程式統一成一致的操作方式，讓使用者只需專注在處理「事件」，就可以快速開發出應用。它也支援『房間』（Rooms）的概念，可以使用同一條 WebSocket 卻擁有不被彼此干擾的資料傳輸（多種聊天頻道的概念）。

另外，它提供了很好的 fallback 機制：即使用戶的瀏覽器不支援 WebSocket，還是可以利用 Flash、XMLHttpRequest 等方式來傳送資訊（速度會比較慢就是了）。這些機制它都包裝好了，寫程式時並不需要知道這些細節，只需要設定好就可以運作。

## Socket.io 有哪些特性？

- **Events**：自訂事件。
- **Rooms**：Room 的概念只存在於伺服器端，可以理解為訊息處理時的聽眾分組，可對同一個分組內的聽眾進行廣播。
- **Namespaces**：命名空間，我理解為底層連線的分組管理。不同命名空間可以走同一條 Engine.io 連線或各自連線，每個命名空間可以各自驗證是否接受連線。
- **ACK 回調**：如同 HTTP 之於 TCP，HTTP 為 TCP 提供了一套請求與響應的模型。ACK 也為 Socket.io 提供了一套請求與響應的通訊模型。
- 連線維護。
- 自動斷線重連。
- ping/pong 心跳。

## 有沒有簡單的入門範例？

下面這段範例監聽 Twitter 上的推文，並即時廣播給所有連線的客戶端：

\`\`\`js
var io = require('socket.io')(80);
var cfg = require('./config.json');
var tw = require('node-tweet-stream')(cfg);
tw.track('socket.io');
tw.track('javascript');
tw.on('tweet', function(tweet) {
  io.emit('tweet', tweet);
});
\`\`\`

## 想深入了解協議要看什麼？

關於 Socket.io 底層的協議細節，可以參考[認識 Socket.io 協議](https://cowsay.blog/post/ocappqt9/)這篇文章。

![Socket.io 協議分層示意圖截圖](/images/articles/socket-io-introduction-1.webp)

## 搭配 nginx 使用要注意什麼？

nginx 反向代理 Socket.io 時需要添加下面兩行配置，讓 WebSocket 的 Upgrade 標頭正確傳遞：

\`\`\`cmd
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "Upgrade";
\`\`\`

如果有多個實例啟動的話，需要保證某個 ip 連接到某個實例之後，一直保持和該實例的連接，而不是被負載均衡隨機分配實例，還需要配置 \`ip_hash\`：

\`\`\`cmd
upstream {
  ip_hash; // 主要是這行，該行還必須在 ip:port 之前，否則會有警告出現
  ip:port;
  ip:port;
  ....
}
\`\`\`

## 根命名空間（/）的行為有什麼陷阱？

使用 Socket.io 時，是有預設的命名空間（/）的：無論客戶端連接的 ns 是哪一個，都會先進入根 ns，並且會記錄下這個客戶端。換句話說，如果有 2 個客戶端連接 ns1、3 個客戶端連接 ns2，那麼在 \`/\` 下就會有 5 個客戶端，並且在根 ns 下監聽連接事件也是會進入的。

## 常見問題

### Socket.io 和 WebSocket 有什麼差別？

WebSocket 是瀏覽器提供的底層通信協議；Socket.io 是建構在 WebSocket（或降級方案）之上的函式庫，額外提供事件模型、房間、命名空間、ACK 回調、自動重連與心跳等封裝功能。

### 瀏覽器不支援 WebSocket 時 Socket.io 還能運作嗎？

可以。Socket.io 內建 fallback 機制，會自動改用 Flash、XMLHttpRequest 等方式傳送資訊，只是速度會比較慢，開發者不需自行處理這些細節。

### 為什麼 Socket.io 過 nginx 之後連不上？

因為 nginx 預設不會轉發 WebSocket 的 Upgrade 標頭。必須加上 \`proxy_set_header Upgrade $http_upgrade;\` 與 \`proxy_set_header Connection "Upgrade";\`，多實例場景還要在 upstream 加上 \`ip_hash\` 維持 session 黏性。

### 不同 Namespace 的客戶端會互相干擾嗎？

底層連線上所有客戶端都會先進入根命名空間（/），所以 \`/\` 下的連線數是所有 ns 的總和；但各命名空間的事件與資料仍是分組管理的，不會互相干擾。

## 參考資料

- [Socket.io 官方網站](https://socket.io/)
- [socket.io 官方文档中文版](https://zhuanlan.zhihu.com/p/29148869)
- [JS 实时通信三把斧系列之二: socket.io](https://juejin.im/entry/5ae6e59bf265da0b80708411)
- [socket.io 原理分析](https://www.jianshu.com/p/a3e06ec1a3a0)
- [認識 Socket.io 協議](https://cowsay.blog/post/ocappqt9/)

## 延伸閱讀

- [Socket.IO 自行增加 Header：Server CORS 與 Client extraHeaders 設定](/post/socketio-custom-header)：同樣聚焦 WebSocket、Node.js，可接著比較不同情境的做法。
- [Socket.IO probe transport websocket failed：原因與 Cookie 分流解法](/post/socketio-probe-websocket-failed)：同樣聚焦 WebSocket，可接著比較不同情境的做法。
- [Engine.io 介紹](/post/engine-io-introduction)：同樣聚焦 WebSocket，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-03-13，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};