var e=`---
title: Line Bot圖文回覆的幾個功能
description: 整理 LINE Bot 開發常用的互動功能：快速回覆按鈕、LIFF 前端框架、圖文選單（Rich Menu）與 Flex Message。包含 LIFF 起始應用程式安裝步驟、Netlify 部署、圖文選單設定方式與 Flex Message 結構說明。
date: 2024-11-08
category: 後端開發
tags: [LINE Bot, Messaging API, LIFF, Rich Menu, Flex Message]
readingTime: 8 分鐘
image: /images/tech/hero_line-bot-rich-menu-liff-flex-message.webp
imageAlt: 手持智慧型手機使用聊天應用程式傳送訊息的畫面
---


# Line Bot圖文回覆的幾個功能

我在開發 LINE Bot 時，最常被問到的就是「機器人除了回文字之外還能做什麼」。這篇筆記整理我在實作中常用的幾個互動功能：快速回覆按鈕、LIFF 網頁前端框架、圖文選單（Rich Menu）與 Flex Message，並附上我在設定 LIFF 與圖文選單時的實際步驟。

## 快速回覆按鈕怎麼用？什麼時候會消失？

官網教學：[https://developers.line.biz/en/docs/messaging-api/using-quick-reply/#set-quick-reply-buttons](https://developers.line.biz/en/docs/messaging-api/using-quick-reply/#set-quick-reply-buttons)

可在訊息中加入快速回覆按鈕，讓使用者能夠快速回應。快速回覆功能可在一對一聊天、群組聊天和多人的聊天中使用，每則訊息最多可設定 13 個快速回覆按鈕。

快速回覆按鈕的消失時機：

- 當使用者點擊快速回覆按鈕時，按鈕會消失（相機、相簿、日期時間選擇器和位置資訊等動作除外，這些按鈕會保留直到使用者提供所需資訊）。
- 如果聊天室中有新的訊息（無論是來自官方帳號、使用者或其他成員），快速回覆按鈕也會消失。若新訊息被刪除，按鈕會重新出現。

## 什麼是 LINE Front-end Framework（LIFF）？

LINE 前端框架（LIFF，LINE Front-end Framework）是由 LINE 提供的網頁應用程式框架，透過將 LIFF SDK 整合至網頁應用程式，我可以存取 LINE 平台提供的資訊，或使用 LINE 應用程式的功能。

主要功能：

- **與 LINE Login 和 LINE 平台整合**：LIFF 與 LINE Login 整合，可以透過 LINE 平台的授權流程，安全地存取使用者的個人資料。
- **分享目標選擇器**：這是一個強大的工具，允許使用者透過 LIFF 應用程式，選擇 LINE 好友並傳送訊息。

## 如何開始使用 LIFF 起始應用程式？

為了協助新手快速上手，LINE 提供了 LIFF 起始應用程式，這是一個包含基本功能的範本，開發者可以在此基礎上進行自訂和開發。

開始使用 LIFF 起始應用程式的步驟：

1. **環境準備**：
   - **Node.js**：確保已安裝 Node.js，建議版本為 16.13.1。
   - **Yarn**：使用 Yarn 作為套件管理工具，建議版本為 1.22.17。
   - **Netlify CLI**：若計劃使用 Netlify 部署，建議版本為 9.16.3。
2. **下載並執行原始碼**：
   - **下載原始碼**：在終端機中執行以下指令，下載 LIFF 起始應用程式的原始碼：

   \`\`\`bash
   git clone https://github.com/line/line-liff-v2-starter.git
   \`\`\`

   - **選擇實作版本**：在 \`line-liff-v2-starter/src/\` 目錄下，有三種實作版本可供選擇：
     - **Vanilla JavaScript**：\`line-liff-v2-starter/src/vanilla\`
     - **Next.js**：\`line-liff-v2-starter/src/nextjs\`
     - **Nuxt.js**：\`line-liff-v2-starter/src/nuxtjs\`
   - **安裝依賴套件並啟動**：進入所選目錄後，執行以下指令安裝套件並啟動應用程式：

   \`\`\`bash
   yarn install
   yarn dev
   \`\`\`

   啟動後，可在瀏覽器中訪問 \`http://localhost:3000\` 查看應用程式。
3. **部署至伺服器**：
   - **使用 Netlify 部署**：若尚未有 Netlify 帳號，請先註冊。安裝 Netlify CLI 後，執行以下指令部署應用程式：

   \`\`\`bash
   netlify deploy
   \`\`\`

   按照指示完成部署流程。
4. **取得並設定 LIFF ID**：
   - **建立 LINE Login 頻道**：在 LINE Developers Console 中，建立一個 LINE Login 頻道。
   - **新增 LIFF 應用程式**：在該頻道中，新增 LIFF 應用程式，並設定相關資訊，如端點 URL。
   - **設定 LIFF ID**：取得 LIFF ID 後，將其設定為環境變數，確保應用程式能正確運行。

LIFF 視窗的大小可以以下三種大小之一顯示：Compact、Tall、Full。

## 如何在 LINE 平台上新增 LIFF 應用程式？

要在 LINE 平台上運行 LIFF 應用程式，需要將其新增至 LINE Login 頻道。以下是詳細步驟：

1. **準備工作**
   - **建立頻道**：在 LINE Developers Console 中，建立一個 LINE Login 頻道。
   - **部署應用程式**：將 LIFF 應用程式部署至伺服器，確保其可透過 HTTPS 存取。
2. **新增 LIFF 應用程式**
   - **登入 LINE Developers Console**：使用帳號登入。
   - **選擇頻道**：在主控台中，選擇要新增 LIFF 應用程式的 LINE Login 頻道。
   - **進入 LIFF 頁籤**：點擊「LIFF」頁籤。
   - **新增 LIFF 應用程式**：點擊「新增」按鈕，開始設定。
3. **設定 LIFF 應用程式資訊**
   - **應用程式名稱**：輸入 LIFF 應用程式的名稱，請避免使用「LINE」或類似字樣。
   - **視圖大小**：選擇應用程式的視圖大小，可選擇「Compact」、「Tall」或「Full」。
   - **端點 URL**：輸入 LIFF 應用程式的 HTTPS URL，請確保該 URL 可正常存取。
   - **權限範圍（Scopes）**：根據應用程式需求，選擇所需的權限範圍，如 \`openid\`、\`profile\`、\`email\` 等。
   - **加好友選項**：設定使用者在使用應用程式時，是否顯示加好友選項。
4. **完成設定**
   - **確認並新增**：檢查所有設定，確保無誤後，點擊「新增」按鈕。

取得 LIFF ID 和 URL：新增成功後，系統會生成 LIFF ID 和 LIFF URL，可在應用程式中使用這些資訊。

## 圖文選單（Rich Menu）是什麼？怎麼設定？

在 LINE 的 Messaging API 中，圖文選單（Rich Menu）是一種可自訂的互動式選單，可提升使用者與 LINE 官方帳號之間的互動體驗。

圖文選單的結構：

- **選單圖片**：一張 JPEG 或 PNG 格式的圖片，包含選單項目。
- **可點擊區域**：在圖片上定義的區域，每個區域可設定不同的動作，如開啟網址或發送訊息。
- **聊天列**：位於聊天視窗底部的選單，可自訂其顯示文字，用於開啟或關閉圖文選單。

設定圖文選單的方法：

| 方法 | 特點 | 適合情境 |
|---|---|---|
| [使用 LINE 官方帳號管理後台](https://manager.line.biz/) | 透過圖形介面快速建立和設定圖文選單 | 需要快速開發且不需高度自訂的情境 |
| 使用 Messaging API | 提供進階自訂功能，如設定 postback 動作或日期時間選擇器 | 需要高度自訂和動態管理圖文選單的情境 |

在 LINE 的 Messaging API 中，可以為特定使用者設定專屬的圖文選單（Rich Menu）：

[https://developers.line.biz/en/docs/messaging-api/use-per-user-rich-menus/#unlink-the-rich-menu-from-user](https://developers.line.biz/en/docs/messaging-api/use-per-user-rich-menus/#unlink-the-rich-menu-from-user)

同一個使用者可設定多個選單來切換。

## Flex Message 的結構是怎麼組成的？

Flex Message 是 LINE 提供的一種訊息格式，允許開發者透過 JSON 定義訊息的結構和樣式，以實現高度自訂的訊息內容。這種訊息格式適用於各種情境，如商品推薦、訂單確認等，提供豐富的視覺效果和互動性。

這個模擬器可以線上模擬呈現效果：[https://developers.line.biz/flex-simulator/](https://developers.line.biz/flex-simulator/)

Flex Message 的結構由三個主要部分組成：

1. **容器（Container）**：最外層的結構，包含訊息的主要內容。主要有兩種類型：
   - **Bubble**：單一訊息泡泡。
   - **Carousel**：多個訊息泡泡的輪播。
2. **區塊（Block）**：組成 Bubble 的部分，包括：
   - **Header**：標題區塊。
   - **Hero**：主要圖片或影片區塊。
   - **Body**：主要內容區塊。
   - **Footer**：底部區塊。
3. **元件（Component）**：構成區塊的元素，如文字、圖片、按鈕等。

## 常見問題

### 每則訊息最多可以設定幾個快速回覆按鈕？

每則訊息最多可設定 13 個快速回覆按鈕，並可在一對一聊天、群組聊天與多人聊天中使用。使用者點擊後按鈕會消失，但相機、相簿等需要使用者提供資訊的動作會保留。

### LIFF 應用程式一定要部署到 Netlify 嗎？

不一定。Netlify 只是起始應用程式文件中建議的部署選項，任何能提供 HTTPS 端點的伺服器都可以。重點是端點 URL 必須可以透過 HTTPS 正常存取。

### 圖文選單該用管理後台還是 Messaging API 設定？

如果只需要快速建立固定的選單，用 LINE 官方帳號管理後台的圖形介面最省事。若需要 postback、日期時間選擇器，或要為不同使用者動態切換專屬選單，就要用 Messaging API。

### Flex Message 和一般文字訊息有什麼不同？

Flex Message 用 JSON 定義訊息的結構與樣式，可以做出卡片、輪播等豐富版面，適合商品推薦、訂單確認等情境。開發時可先用官方 Flex Simulator 線上預覽效果。

## 參考資料

- [LINE Messaging API：Quick reply 官方文件](https://developers.line.biz/en/docs/messaging-api/using-quick-reply/#set-quick-reply-buttons)
- [LINE Messaging API：Per-user rich menu 官方文件](https://developers.line.biz/en/docs/messaging-api/use-per-user-rich-menus/#unlink-the-rich-menu-from-user)
- [LINE Flex Message Simulator](https://developers.line.biz/flex-simulator/)

## 延伸閱讀

- [LINE Bot 圖文回覆實戰：快速回覆、LIFF、圖文選單與 Flex Message 完整整理](/post/line-bot-rich-menu-liff-flex-message)：同樣聚焦 LINE Bot、LIFF，可接著比較不同情境的做法。
- [使用 n8n 與 LINE Bot 搭建 RAG AI 應用](/post/n8n-linebot-rag-ai-application)：同樣聚焦 LINE Bot，可接著比較不同情境的做法。
- [免程式碼將 ChatGPT 串接到 LINE 對話：FancyAI 與 LINE Bot 設定流程](/post/no-code-chatgpt-line-bot-integration)：同樣聚焦 LINE Bot，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-11-08，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};