var e=`---
title: Engine.io 介紹
description: Engine.IO 是 Socket.IO 的底層即時通訊引擎，負責 WebSocket 與 polling 的傳輸升級機制。本文介紹 Engine.IO 的架構、握手流程、封包格式與和 Socket.IO 的關係。
date: 2020-03-13
category: 後端開發
tags: [Engine.IO, Socket.IO, WebSocket, 長輪詢, 即時通訊]
readingTime: 5 分鐘
image: /images/tech/hero_engine-io-introduction.webp
imageAlt: Engine.io 工作流程圖
---


# Engine.io 介紹

Socket.IO 好用，但它底層是怎麼運作的？Socket.io 是在 engine.io 的基礎上去實作的。\`engine.io\` 為 \`socket.io\` 提供跨瀏覽器、跨設備的雙向通信底層庫，封裝了 WebSocket 和 XHR 兩種方式，並能在不支援 WebSocket 的舊瀏覽器上自動改用長輪詢。這篇整理 engine.io 的連線方式設定、工作流程與編碼格式。

## Engine.io 是什麼？

Socket.io 是在 engine.io 的基礎上去實作的。

Gitlab 連結：[Engine.IO: the realtime engine](https://github.com/socketio/engine.io)

\`engine.io\` 為 \`socket.io\` 提供跨瀏覽器/跨設備的雙向通信的底層庫。\`engine.io\` 使用了 \`Websocket\` 和 \`XHR\` 方式封裝了一套 \`socket\` 協議。在低版本的瀏覽器中，不支援 Websocket，為了兼容使用長輪詢（polling）替代。

關於長輪詢可參考我的另一篇文章：[WebSocket 與 Ajax 的不同](/post/websocket-vs-ajax)

過去 WebSocket 未出來時，許多聊天室使用的都是長輪詢的方式去實作，而 engine.io 則可依據客戶端環境兼容使用這兩種方式。

## 連線方式要怎麼設定？

在 engine.io 的 constructor 的參數裡有一個值是 \`transports\`，這邊的 polling 指的就是長輪詢。預設值是會先用 polling（HTTP）去詢問，若回傳 \`101 Switching Protocols\` 則才發起 websocket 連接。

\`\`\`
transports (<Array> String): transports to allow connections to (['polling', 'websocket'])
\`\`\`

請參考 [RFC 7231 規範](https://developer.mozilla.org/en-US/docs/Web/HTTP/Protocol_upgrade_mechanism)。

**注意：這一點很重要**，默認的會使用長輪詢的連接方式作為第一手方案，隨後如果設備支持的話會升級到使用 WebSocket。如果 \`transports\` 選項的值設置為 \`['websocket']\`，則意味著直接使用 WebSocket 方式建立連接，並且如果這一連接方式不能使用，也不會自動切換到備用的連接方案（polling）。因此目前建議使用默認的設置即可，除非你明白確信使用場景和你想要做什麼。

## Engine.io 的工作流程長什麼樣？

![Engine.io 從長輪詢升級到 WebSocket 的工作流程圖](/images/articles/engine-io-introduction-1.webp)

![Engine.io 連線過程的封包流程截圖](/images/articles/engine-io-introduction-2.webp)

## Engine.io 有哪兩種編碼方式？

engine.io 有兩種編碼方式：

### packet

例如：\`2probe\` => 2（packet type id）+ probe（data）

| Type | 說明 |
| --- | --- |
| \`0 open\` | 當打開一個新傳輸時，服務端檢測並發送 |
| \`1 close\` | 請求關閉傳輸，但不是主動斷開連接 |
| \`2 ping\` | 客戶端發出，服務端應該返回包含相同數據的 pong packet 進行應答 |
| \`3 pong\` | 服務端發出，用以響應客戶端的 ping packet |
| \`4 message\` | 真實數據，客戶端和服務端應該調用回調中的 data |
| \`5 upgrade\` | 升級傳輸方式 |
| \`6 noop\` | 空操作 |

### payload

Payload 是綁定在一起的一系列編碼分組，其格式是：\`<length1>:<packet1>[<length2>:<packet2>[...]]\`

例如：

\`\`\`json
97:0{"sid":"Peed250dk55pprwgAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":60000}2:40
\`\`\`

## Engine.io 支持哪些傳輸方式？

engine.io 支持的傳輸方式：

- websocket
- polling：jsonp、xhr

## 常見問題

### Engine.io 和 Socket.IO 的關係是什麼？

Socket.io 是在 engine.io 的基礎上去實作的，engine.io 是底層的雙向通信引擎，負責連線、傳輸與編碼；Socket.IO 則在其上加入了命名空間、房間、事件等高階功能。

### 為什麼 engine.io 預設先用 polling 再升級到 WebSocket？

為了兼容不支援 WebSocket 的低版本瀏覽器。預設先用長輪詢（HTTP）詢問，若伺服器回傳 101 Switching Protocols 才發起 WebSocket 連接，確保任何環境都能建立連線。

### 可以直接設定只用 WebSocket 嗎？

可以，把 \`transports\` 設為 \`['websocket']\` 就會直接用 WebSocket 建立連接，但如果連不上也不會自動切換回 polling。除非確信使用場景，否則建議使用默認設定。

### 什麼是 payload 格式？

Payload 是綁定在一起的一系列編碼分組，格式為 \`<length1>:<packet1>[<length2>:<packet2>[...]]\`，例如 \`2:40\` 代表長度 2 的 \`40\` 封包。

## 參考資料

- [認識 Socket.io 協議](https://cowsay.blog/post/ocappqt9/)
- [socket.io 原理分析](https://www.jianshu.com/p/a3e06ec1a3a0)
- [socket.io 官方文档中文版](https://zhuanlan.zhihu.com/p/29148869)
- [JS 实时通信三把斧系列之二: socket.io](https://juejin.im/entry/5ae6e59bf265da0b80708411)

## 延伸閱讀

- [Socket.IO probe transport websocket failed：原因與 Cookie 分流解法](/post/socketio-probe-websocket-failed)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。
- [Socket.IO 錯誤訊息意義：ping timeout、transport close 與 disconnect](/post/socketio-error-messages)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。
- [Socket.IO 自行增加 Header：Server CORS 與 Client extraHeaders 設定](/post/socketio-custom-header)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-03-13，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};