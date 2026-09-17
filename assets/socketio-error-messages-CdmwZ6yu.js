var e=`---
title: Socket.IO 常見錯誤訊息：ping timeout 與 disconnect
description: 整理 Socket.IO 常見斷線與錯誤訊息，說明 ping timeout、transport close、namespace disconnect 與 transport error 的判讀方式。
date: 2020-03-16
category: 後端開發
tags: [Socket.IO, WebSocket, 即時通訊]
readingTime: 6 分鐘
image: /images/tech/hero_socketio-error-messages.webp
imageAlt: Socket.IO 連線錯誤與斷線原因分析示意圖
---
# Socket.IO 錯誤訊息意義：ping timeout、transport close 與 disconnect

Socket.IO 錯誤訊息通常是在描述連線為什麼結束，而不是一定代表程式 bug。\`ping timeout\` 多半是心跳逾時，\`transport close\` 常見於頁面關閉或網路中斷，namespace disconnect 則通常是 client 或 server 主動斷線。

## \`ping timeout\` 是什麼意思？

\`ping timeout\` 代表 client 在 \`pingTimeout\` 允許時間內沒有回應 pong。常見原因包含網路中斷、瀏覽器背景節流、行動網路切換或 client 主執行緒被長任務卡住。

排查方向：

| 檢查項目 | 說明 |
| --- | --- |
| \`pingInterval\` | server 發送 ping 的頻率 |
| \`pingTimeout\` | 等待 pong 的最長時間 |
| client 主執行緒 | 長任務可能讓 pong 延遲 |
| 行動網路 | Wi-Fi 與 4G 切換可能造成短暫斷線 |
| proxy timeout | 中間層可能提早關閉閒置連線 |

若 \`ping timeout\` 偶發出現在手機或背景分頁，不一定是 server 異常。若大量 client 同時出現，應檢查 proxy、部署或網路事件。

## \`transport close\` 是什麼意思？

\`transport close\` 表示底層 transport 被關閉。使用者關閉分頁、重新整理、網路品質差、proxy 關閉連線，或 server 重啟都可能造成這個訊息。

原始討論指出，關閉或 reload 頁面時會看到 \`transport close\`；網路狀況不好、ping packet 沒有送達 client 時也可能發生。

資訊增益：\`transport close\` 不適合單獨拿來判斷「使用者主動離開」。若產品需要區分關頁與斷網，應搭配前端 \`beforeunload\`、server reconnect window 與最後活動時間判斷。

## namespace disconnect 類錯誤代表什麼？

namespace disconnect 通常表示 Socket.IO namespace 層級的主動斷線。client 呼叫 \`disconnect()\` 和 server 呼叫 \`socket.disconnect()\`，會產生不同訊息。

常見訊息：

| 訊息 | 意義 |
| --- | --- |
| \`client namespace disconnect\` | client 呼叫 \`client.disconnect()\` |
| \`server namespace disconnect\` | server 呼叫 \`socket.disconnect()\` |
| \`io server disconnect\` | server 端斷開連線，常見於驗證失敗 |

如果驗證 middleware 判定 token 無效，server 可能主動斷線。這種情境應在 client 顯示登入過期或重新登入提示，而不是無限重連。

## \`transport error\` 是什麼意思？

\`transport error\` 是底層傳輸發生錯誤的統稱。可能原因包含 WebSocket 握手失敗、代理設定錯誤、TLS 問題、CORS 錯誤或網路中斷。

排查順序：

1. 檢查瀏覽器 Network 的 WebSocket request。
2. 確認 HTTP status code 與 response header。
3. 檢查 Nginx 或負載平衡器是否轉發 upgrade header。
4. 比對 server log 的 socket id 與錯誤時間。
5. 檢查 CORS、Cookie、認證 token 與 sticky session。

\`transport error\` 的資訊太泛，不能只靠錯誤字串下結論。需要同時看 client log、server log 與 proxy log。

## Socket.IO 錯誤要如何記錄才好查？

Socket.IO 斷線紀錄應包含 socket id、user id、namespace、transport、reason、時間與目前網路環境。缺少這些欄位時，後續只能猜測原因。

建議紀錄欄位：

| 欄位 | 用途 |
| --- | --- |
| \`socket.id\` | 對應單次連線 |
| \`userId\` | 對應使用者 |
| \`reason\` | Socket.IO 斷線原因 |
| \`transport\` | polling 或 websocket |
| \`namespace\` | 哪個 namespace 斷線 |
| \`connectedAt\` | 連線存活時間 |
| \`serverInstance\` | 多後端時定位分流問題 |

這些欄位能幫助區分程式錯誤、使用者離開、網路波動與部署問題。

## 常見問題

### \`ping timeout\` 是 server 壞掉嗎？

不一定。\`ping timeout\` 只代表心跳逾時，可能是 client 端網路、背景分頁節流或 proxy timeout。

### \`transport close\` 可以當作使用者關閉網頁嗎？

不能完全當作。關頁會造成 \`transport close\`，但網路中斷與 proxy 關閉連線也可能造成同樣訊息。

### \`client namespace disconnect\` 是錯誤嗎？

通常不是。這表示 client 主動呼叫 disconnect，可能是正常登出、切換頁面或程式主動關閉連線。

### \`io server disconnect\` 後 client 會自動重連嗎？

依 Socket.IO 行為與 client 設定而定。若 server 主動斷線是因驗證失敗，應先更新 token 或重新登入。

### Socket.IO 斷線要怎麼避免誤判？

不要只看 reason 字串。應同時記錄使用者操作、網路狀態、transport、server instance 與 reconnect 結果。

## 參考資料

- Socket.IO Docs：[Server socket instance](https://socket.io/docs/v4/server-socket-instance/)
- Socket.IO Docs：[Client socket instance](https://socket.io/docs/v4/client-socket-instance/)
- GitHub Issue：[socket.io issue 3101](https://github.com/socketio/socket.io/issues/3101)

## 延伸閱讀

- [Engine.io 介紹](/post/engine-io-introduction)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。
- [Socket.IO probe transport websocket failed：原因與 Cookie 分流解法](/post/socketio-probe-websocket-failed)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。
- [Socket.IO 自行增加 Header：Server CORS 與 Client extraHeaders 設定](/post/socketio-custom-header)：同樣聚焦 Socket.IO、WebSocket，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2020-03-16，本文把錯誤訊息整理成排查表，並補上紀錄欄位建議。

`;export{e as default};