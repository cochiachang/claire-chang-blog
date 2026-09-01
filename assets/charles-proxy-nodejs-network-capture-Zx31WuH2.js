var e=`---
title: 使用 Charles Proxy 抓取 Node.js 網路請求：Reverse Proxy 設定教學
description: 說明如何用 Charles Proxy Reverse Proxy 抓取 Node.js HTTP 與 HTTPS 請求。
date: 2020-02-27
category: 後端開發
tags: [Charles Proxy, Node.js, Reverse Proxy, HTTPS, 網路除錯]
readingTime: 5 分鐘
image: /images/tech/charles-proxy-reverse-proxy-settings.webp
imageAlt: Charles Proxy Reverse Proxy 設定視窗，包含本機 port 與遠端 host 設定
---


# 使用 Charles Proxy 抓取 Node.js 網路請求：Reverse Proxy 設定教學

使用 Charles Proxy 抓取 Node.js 網路請求時，我最常用的方法是開 Charles Proxy 的 Reverse Proxy，讓 Node.js 原本要連到遠端主機的 request 改連 \`localhost\` 的指定 port。Charles Proxy 再把流量轉送到真正的遠端主機，這樣就能在 Charles Proxy 裡看到 request 與 response。

## 為什麼 Node.js 請求適合用 Charles Proxy Reverse Proxy 抓？

Charles Proxy Reverse Proxy 適合用在 client application 不方便設定 HTTP proxy 的情境。Node.js 服務只要能改 host 與 port，就能把流量導進 Charles Proxy，再由 Charles Proxy 轉送到遠端伺服器。

Charles Proxy 的官方文件說明，Reverse Proxy 會在本機 port 建立一個 web server，透明地把請求代理到遠端 web server，並讓 Charles Proxy 記錄所有 request 與 response（Charles Proxy Documentation，Reverse Proxy，存取日期 2026-08-28）。這個特性很適合後端除錯，因為 Node.js 程式通常不像瀏覽器一樣會自動套用系統代理設定。

我通常在這幾種情境使用 Charles Proxy Reverse Proxy：

| 情境 | 為什麼適合 |
|---|---|
| Node.js 服務呼叫外部 API | 可以看到實際送出的 path、header、body 與 response |
| SDK 或第三方套件內部發 request | 不必改 SDK，只要把 endpoint 指到本機 port |
| 本機除錯 HTTP 或 HTTPS 問題 | 可以快速確認 request 是否真的送出、參數是否符合預期 |
| client 不支援 proxy 設定 | 用本機 port 包一層，比找 proxy hook 更直接 |

## Charles Proxy 要怎麼設定 HTTP Reverse Proxy？

Charles Proxy HTTP Reverse Proxy 的設定重點是指定一個未使用的 Local Port，再填入真正的 Remote Host 與 Remote Port。Node.js 之後只連 Local Port，Charles Proxy 負責轉送。

先在 Charles Proxy 裡開啟 Reverse Proxies：

1. 打開 Charles Proxy。
2. 點選選單 \`Proxy\` -> \`Reverse Proxies...\`。
3. 勾選 \`Enable Reverse Proxies\`。
4. 新增一筆 reverse proxy 設定。

![Charles Proxy 的 Proxy 選單中可以找到 Reverse Proxies 設定](/images/tech/charles-proxy-reverse-proxies-menu.webp)

以 \`claire-chang.com\` 為例，我會這樣填：

| 欄位 | 設定值 | 說明 |
|---|---|---|
| Local Port | \`60103\` | 任意未被佔用的本機 port |
| Remote Host | \`claire-chang.com\` | Node.js 原本要連線的目標主機 |
| Remote Port | \`80\` | HTTP 通常使用 \`80\` |

![Charles Proxy Reverse Proxy 設定本機 port 60103 並轉送到 claire-chang.com:80](/images/tech/charles-proxy-reverse-proxy-settings.webp)

Charles Proxy 官方文件也提到，HTTP 目的地通常使用 port \`80\`，HTTPS 目的地通常使用 port \`443\`；若建立 HTTPS reverse proxy，client 也要用 HTTPS 連到本機位置（Charles Proxy Documentation，Reverse Proxy，存取日期 2026-08-28）。

## Node.js 程式要怎麼改連 Charles Proxy？

Node.js 程式要改連 Charles Proxy 時，把原本的遠端 host 改成 \`localhost\`，port 改成 Charles Proxy Reverse Proxy 的 Local Port。path、method、header 與 body 可以照原本 API 呼叫邏輯保留。

如果原本 Node.js 連線目標是：

\`\`\`text
http://claire-chang.com/api/example
\`\`\`

設定 Charles Proxy Reverse Proxy 後，Node.js 端改成：

\`\`\`js
const options = {
  host: "localhost",
  port: 60103,
  path: "/api/example",
  method: "GET",
};
\`\`\`

重點不是把 API path 改掉，而是把主機與 port 換成 Charles Proxy 開在本機的入口。Charles Proxy 收到 \`localhost:60103\` 的請求後，會把同一個 request 轉送到 \`claire-chang.com:80\`。

我的檢查順序通常是：

1. 先確認 Charles Proxy 的 recording 有開。
2. 確認 Node.js 連的是 \`localhost\` 與 Local Port。
3. 確認 Charles Proxy session 裡有出現新的 request。
4. 若沒有 request，先檢查 port 是否被其他程式佔用。
5. 若有 request 但 response 異常，再看 Remote Host、Remote Port、path 是否一致。

## HTTPS 請求要注意什麼？

Charles Proxy 抓 Node.js HTTPS 請求時，常見問題是憑證驗證。\`NODE_TLS_REJECT_UNAUTHORIZED=0\` 可以讓 Node.js 不驗證 TLS 憑證，但這只適合本機除錯，不應放進正式環境。

如果目標是 HTTPS，Reverse Proxy 的 Remote Port 通常要改成 \`443\`，Node.js 連本機時也要使用 HTTPS URL。Charles Proxy 文件明確說明，HTTPS reverse proxy 要用 \`https://localhost:<port>/\` 連入（Charles Proxy Documentation，Reverse Proxy，存取日期 2026-08-28）。

本機快速測試時，我曾經用這行讓 Node.js 接受不明憑證：

\`\`\`js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
\`\`\`

Node.js 官方文件說明，當 \`NODE_TLS_REJECT_UNAUTHORIZED\` 設為 \`0\` 時，TLS 連線會停用憑證驗證，這會讓 TLS 與 HTTPS 變得不安全，因此官方強烈不建議使用這個環境變數（Node.js Documentation，Command-line API，存取日期 2026-08-28）。

比較安全的做法是只在本機除錯期間短暫使用，並避免把這段設定 commit 到專案。若團隊需要長期除錯 HTTPS，應改用信任 Charles Proxy 憑證或用 \`NODE_EXTRA_CA_CERTS\` 指向受信任的 CA 憑證檔。

## 我會怎麼判斷設定是否成功？

Charles Proxy Reverse Proxy 設定成功時，Node.js request 會出現在 Charles Proxy session list 裡，而且目標 path、header、query string 與 response body 都能被檢查。若只看到連線錯誤，通常是 host、port 或 HTTPS 憑證問題。

我會用這張表快速排查：

| 現象 | 優先檢查 |
|---|---|
| Charles Proxy 完全沒有出現 request | Node.js 是否真的改連 \`localhost\` 與 Local Port |
| Node.js 回報 \`ECONNREFUSED\` | Local Port 是否填錯，或 Charles Proxy Reverse Proxy 是否未啟用 |
| Charles Proxy 有 request 但遠端連不上 | Remote Host、Remote Port 是否填對 |
| HTTP 可以，HTTPS 失敗 | Node.js 是否用 HTTPS 連本機，以及 TLS 憑證是否被信任 |
| request path 不符合預期 | Node.js 程式是否同時改到了 path 或 base URL |

這個方法的好處是改動很小：只要把 Node.js endpoint 暫時改成 \`localhost:<Local Port>\`，除錯結束後再切回原本設定。對於只想確認 request 內容的情境，Charles Proxy Reverse Proxy 比在程式碼裡到處加 log 乾淨很多。

## 常見問題

Charles Proxy 抓 Node.js 網路請求的常見問題，多半集中在 Reverse Proxy 與 TLS 憑證。先把 HTTP 流程跑通，再處理 HTTPS，會比一開始就同時排查所有問題穩定。

### Charles Proxy 可以直接抓 Node.js 的所有網路請求嗎？
不一定。Node.js 程式不一定會自動使用系統代理，所以我通常改用 Charles Proxy Reverse Proxy，把 Node.js 要連的 host 與 port 暫時改到 \`localhost:<Local Port>\`。這樣 Charles Proxy 才能穩定看到該段 request。

### Local Port 一定要用 60103 嗎？
不用。\`60103\` 只是範例，Local Port 可以換成任何未被佔用的本機 port。重點是 Charles Proxy Reverse Proxy 設定的 Local Port，要和 Node.js 程式改連的 port 完全一致。

### Remote Host 要不要加 \`http://\` 或 \`https://\`？
不要。Charles Proxy Reverse Proxy 的 Remote Host 填主機名稱即可，例如 \`claire-chang.com\`。通訊協定主要由 Remote Port 與 client 連入本機時使用 HTTP 或 HTTPS 來決定。

### Node.js HTTPS 請求一直出現憑證錯誤怎麼辦？
先確認 Charles Proxy 的 HTTPS reverse proxy 是用 \`https://localhost:<Local Port>/\` 連入。若只是本機短暫除錯，可以用 \`process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"\` 排除憑證問題，但這個設定會停用 TLS 憑證驗證，不應放到正式環境。

### Charles Proxy 有看到 request，但 response 不是預期內容怎麼查？
先看 Charles Proxy session 裡的 host、port、path 是否和目標 API 一致。若 host 與 port 正確，再檢查 Node.js 是否保留原本的 path、query string、method、header 與 body。Reverse Proxy 只負責轉送，API 參數仍然由 Node.js 程式決定。

## 參考資料

本文的外部參考以官方文件為主。Charles Proxy Reverse Proxy 流程依 Charles Proxy 文件核對，Node.js TLS 環境變數風險依 Node.js 官方文件補充。

- Charles Proxy Documentation. [Reverse Proxy](https://www.charlesproxy.com/documentation/proxying/reverse-proxy/). 存取日期：2026-08-28。
- Node.js Documentation. [Command-line API：\`NODE_TLS_REJECT_UNAUTHORIZED=value\`](https://nodejs.org/api/cli.html#node_tls_reject_unauthorizedvalue). 存取日期：2026-08-28。

## 延伸閱讀

- [使用 Charles抓取手機網路使用](/post/charles-proxy-mobile-traffic-capture)：同樣聚焦 網路除錯，可接著比較不同情境的做法。
- [Charles 介紹 – 好用的封包抓取工具](/post/charles-proxy-introduction)：同樣聚焦 網路除錯，可接著比較不同情境的做法。
- [Charles 介紹 - 好用的封包抓取工具](/post/charles-proxy-packet-capture)：同樣聚焦 HTTPS，可接著比較不同情境的做法。

## 最後更新

2026-08-28：補上 Charles Proxy Reverse Proxy 的操作說明、Node.js HTTPS 憑證風險提醒、FAQ、參考資料與延伸閱讀。
`;export{e as default};