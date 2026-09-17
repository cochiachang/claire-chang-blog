var e=`---
title: 好用的 API 測試工具 POSTMAN
description: Postman API 測試工具完整介紹：模擬 GET/POST/PUT/DELETE 請求、帳號同步、Header 與變數設定、Pre-request Scripts 到自動化 API 測試與文件產出。
date: 2019-10-13
category: 後端開發
tags: [API, Postman, HTTP, 測試工具]
readingTime: 4 分鐘
image: /images/tech/hero_postman-api-testing-tool.webp
imageAlt: Postman API 測試工具操作畫面
---


# 好用的 API 測試工具 POSTMAN

開發或串接 API 時，最怕的就是不知道請求到底有沒有送對。Postman 是一個可以模擬 HTTP Request 的工具，包含常見的 GET、POST、PUT、DELETE 等請求方式，主要功能就是快速測試 API 是否能夠正常請求資料，並得到正確的請求結果。這篇整理我使用 Postman 的基本操作：帳號同步、發送 Request、Pre-request Scripts、API 文件產出與自動化測試。

## Postman 是什麼？在哪裡下載？

![Postman 軟體介紹頁面截圖](https://img1.xenby.com/151/image000.png)

官方下載點：[https://www.getpostman.com/](https://www.getpostman.com/)

Chrome 擴充功能版：[下載連結](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=zh-TW)

Postman 是一個可以模擬 HTTP Request 的工具，包含常見的 HTTP 請求方式，例如 GET、POST、PUT、DELETE。它的主要功能就是能夠快速測試你的 API 是否能夠正常的請求資料，並得到正確的請求結果。

## 為什麼要使用帳號同步？

使用帳號去同步設定，可以選擇新創一個帳號，或者使用 Google 帳號去同步不同電腦裡的 Postman 設定。

![Postman 帳號登入同步畫面](/images/articles/postman-api-testing-tool-1.webp)

這樣在不同電腦裡面，使用紀錄或者儲存的 Collection 等都可以被同步。

## 怎麼發送一個 Request？

在登入帳號後，按下左上方的「+ New」按鈕，會看到一個創建 Request 的畫面：

![Postman 建立新 Request 的畫面](https://assets.postman.com/postman-docs/WS-createNew-white-p2.png)

有些 API 的網址會有變數，這時可以使用 \`https://api.library.com/:entity/\`，並藉由下面的設定來取代變數 entity：

![Postman 設定網址路徑變數的畫面](https://assets.postman.com/postman-docs/requestBuilderPath.png)

在發送 Request 時，正確的 header 資訊非常重要，可在下面這個頁籤做設定：

![Postman 設定 Request Headers 的頁籤](https://assets.postman.com/postman-docs/WS-headers_white.png)

也可以選擇發送的模式是要使用 POST 或 GET：

![Postman 選擇 GET 或 POST 的下拉選單](https://assets.postman.com/postman-docs/WS-method-menu.png)

更多詳細的教學請見[官方教學](https://learning.getpostman.com/docs/postman/sending_api_requests/requests/)。

## 什麼是 Pre-request Scripts？

如果我們希望每一次打出的某個變數能夠不一樣，這時可以撰寫 \`pre-request scripts\` 來達到這個目的：

![Postman 撰寫 Pre-request Scripts 的畫面](https://assets.postman.com/postman-docs/Test_script3_Updated2.png)

這時可以在傳送的參數裡用 \`{{timestampHeader}}\` 來存取 \`timestampHeader\` 這個變數：

![在參數中使用變數的畫面](https://assets.postman.com/postman-docs/Test_script4_Updated3.png)

## 能不能把測試資料變成 API 文件？

在 Postman 測試的資料可以轉換成精美的 HTML API 文件：

![Postman 將測試資料轉成網頁文件的畫面](https://assets.postman.com/postman-docs/view-web-documentation.png)

更多資料請見[官網](https://learning.getpostman.com/docs/postman/api_documentation/intro_to_api_documentation)。

## 如何用 Postman API 自動化呼叫 API 測試？

在下面的畫面裡按下「Get API Key」的按鈕，可以取得呼叫 API 測試的密鑰：

![Postman 取得 API Key 的畫面](https://assets.postman.com/postman-docs/WS-postmanAPI-apiKey.png)

## 常見問題

### Postman 是免費的嗎？

Postman 提供免費方案，個人使用上非常足夠；團隊協作、進階功能則需要付費方案。註冊帳號後還可以同步不同電腦間的設定與 Collection。

### Postman 可以測試哪些 HTTP 請求方式？

常見的 GET、POST、PUT、DELETE 都支援，另外也支援 PATCH、HEAD、OPTIONS 等方式，可以在發送 Request 時直接切換。

### API 網址中的變數要怎麼處理？

可以使用 \`:entity\` 這種冒號語法定義路徑變數，再在 Postman 的變數設定中給予實際值，送出請求時會自動取代。

### 什麼是 Pre-request Scripts？

Pre-request Scripts 是在請求送出前執行的腳本，可以用來動態產生時間戳記、簽章等每次都要不同的參數，並以 \`{{變數名}}\` 的方式在請求中使用。

## 參考資料

- [Postman online document](https://learning.getpostman.com/docs/postman/sending_api_requests/requests/)
- [Postman - 測試 API 神器](https://ithelp.ithome.com.tw/articles/10201503)
- [第 24 天：安裝/使用 Postman](https://ithelp.ithome.com.tw/articles/10195738)

## 延伸閱讀

- [Charles 介紹 – 好用的封包抓取工具](/post/charles-proxy-introduction)：同樣聚焦 HTTP，可接著比較不同情境的做法。
- [Charles 介紹 - 好用的封包抓取工具](/post/charles-proxy-packet-capture)：同樣聚焦 HTTP，可接著比較不同情境的做法。
- [使用 Charles抓取手機網路使用](/post/charles-proxy-mobile-traffic-capture)：同樣聚焦 HTTP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2019-10-13，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};