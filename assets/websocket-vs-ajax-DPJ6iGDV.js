var e=`---
title: WebSocket 與 Ajax 的不同
description: WebSocket 與 Ajax 的差異比較：WebSocket 是 HTML5 在單一 TCP 連線上提供全雙工通訊的協議，只需一次握手即可建立持久連線並讓伺服器主動推送資料；Ajax 輪詢則須由瀏覽器定時發送 HTTP 請求，重複的 header 浪費頻寬。本文整理兩者差異與 readyState 等屬性。
date: 2020-02-26
category: 後端開發
tags: [WebSocket, Ajax, HTTP, 前後端通訊]
readingTime: 3 分鐘
image: /images/tech/hero_websocket-vs-ajax.webp
imageAlt: WebSocket 與 Ajax 通訊方式對比圖
---


# WebSocket 與 Ajax 的不同

做即時推播或聊天功能時，最常被問到的問題就是：到底該用 Ajax 輪詢還是 WebSocket？WebSocket 是 HTML5 開始提供的一種在單個 TCP 連接上進行全雙工通訊的協議，只需一次握手就能建立持久連線並雙向傳輸資料；傳統的 Ajax 輪詢則需要瀏覽器不斷發出 HTTP 請求，浪費頻寬。這篇整理兩者的差異與 WebSocket 的常用屬性。

## WebSocket 是什麼？

WebSocket 是 HTML5 開始提供的一種在單個 TCP 連接上進行**全雙工通訊**的協議。

WebSocket 使得客戶端和服務器之間的數據交換變得更加簡單，允許服務端主動向客戶端推送數據。在 WebSocket API 中，瀏覽器和服務器只需要完成一次握手，兩者之間就直接可以創建持久性的連接，並進行雙向數據傳輸。

也就是說，瀏覽器和服務器只需要做一個握手（polling）的動作，然後瀏覽器和服務器之間就形成了一條快速通道，兩者之間就可以直接互相傳送數據。

## Ajax 輪詢有什麼缺點？

現在，很多網站為了實現推送技術，所用的技術都是 Ajax 輪詢。輪詢是在特定的時間間隔（如每 1 秒），由瀏覽器對服務器發出 HTTP 請求，然後由服務器返回最新的數據給客戶端的瀏覽器。

這種傳統的模式帶來很明顯的缺點：瀏覽器需要不斷的向服務器發出請求，然而 HTTP 請求可能包含較長的 header，其中真正有效的數據可能只是很小的一部分，顯然這樣會浪費很多的頻寬等資源。

HTML5 定義的 WebSocket 協議，能更好地節省服務器資源和頻寬，並且能夠更實時地進行通訊。

## 兩種方式的通訊差別長什麼樣？

下圖是兩種方式的對比圖，可以看到 Ajax 是一直以相同頻率發出 HTTP request，而 WebSocket 在第一次的握手（HTTP）之後就改走 WebSocket 的通道：

![Ajax 輪詢與 WebSocket 通訊流程對比圖](/images/articles/websocket-vs-ajax-1.webp)

## WebSocket 有哪些常用屬性？

### Socket.readyState

屬性 \`readyState\` 表示連接狀態，可以是以下值：

| 值 | 意義 |
| --- | --- |
| 0 | 表示連接尚未建立 |
| 1 | 表示連接已建立，可以進行通信 |
| 2 | 表示連接正在進行關閉 |
| 3 | 表示連接已經關閉或者連接不能打開 |

### Socket.bufferedAmount

read only 屬性 \`bufferedAmount\` 表示已被 \`send()\` 放入正在隊列中等待傳輸、但是還沒有發出的 UTF-8 文本字節數。

## 常見問題

### WebSocket 和 Ajax 最大的差別是什麼？

WebSocket 建立一次握手後就是持久性的雙向連線，伺服器可以主動推送資料；Ajax 輪詢則是瀏覽器定時發出 HTTP 請求再等回應，不僅延遲較高，也會因為重複的 header 浪費頻寬。

### 為什麼說 WebSocket 更省頻寬？

因為 WebSocket 不需要每次請求都帶上完整的 HTTP header，資料是在已建立的通道上直接傳輸，有效資料佔比高得多。

### readyState 等於 0 代表什麼？

代表連接尚未建立。等連線建立成功後值會變成 1，此時才可以進行通信；2 表示正在關閉，3 則表示已關閉或無法打開。

## 參考資料

本文整理自個人實作筆記。

## 延伸閱讀

- [Socket.IO probe transport websocket failed：原因與 Cookie 分流解法](/post/socketio-probe-websocket-failed)：同樣聚焦 WebSocket，可接著比較不同情境的做法。
- [Engine.io 介紹](/post/engine-io-introduction)：同樣聚焦 WebSocket，可接著比較不同情境的做法。
- [Socket.io 是什麼？即時通信庫特性整理、範例與 nginx 配置要點](/post/socket-io-introduction)：同樣聚焦 WebSocket，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2020-02-26，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};