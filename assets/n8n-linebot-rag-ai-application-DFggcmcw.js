var e=`---
title: 使用 n8n 與 LINE Bot 搭建 RAG AI 應用
description: 整理用 n8n 串接 LINE Bot 與 OpenAI Assistant 的 RAG AI 應用流程，包含憑證、Webhook、chatInput、LINE Reply API 與 JSON.stringify 設定。
date: 2025-02-01
category: 生成式AI
tags: [n8n, LINE Bot, RAG, OpenAI Assistant, Webhook]
readingTime: 7 分鐘
image: /images/tech/basic_rag.webp
imageAlt: RAG 資料處理到向量資料庫流程示意圖
---


# 使用 n8n 與 LINE Bot 搭建 RAG AI 應用

使用 n8n 與 LINE Bot 搭建 RAG AI 應用，核心流程是讓 LINE 接收使用者訊息，n8n 負責整理事件資料與呼叫 OpenAI Assistant，最後再透過 LINE Messaging API 把回答回覆給使用者。這種做法適合想快速驗證「專屬知識問答機器人」的人：不用先寫完整後端系統，但仍能保留工作流控制、API 呼叫與資料格式調整的彈性。

需要注意的是，OpenAI 官方文件已將 Assistants API 標示為 deprecated，並記錄 shutdown date 為 2026-08-26；如果是 2026 年 8 月 28 日之後的新專案，請先查 Responses API 與 File Search 的最新做法，再決定要不要沿用本文的舊節點流程（OpenAI Platform，存取日期：2026-08-28）。

## n8n 在 LINE Bot RAG AI 應用中負責什麼？

n8n 是 LINE Bot 與 OpenAI Assistant 之間的流程編排層。n8n 會接收 LINE Webhook 事件、整理輸入欄位、呼叫 AI 節點，再把結果送回 LINE。

n8n 是一款開源的工作流自動化工具，可以透過可視化節點設計和執行自動化流程，完成跨應用與服務的資料整合。無論是簡單的資料同步，還是複雜的跨平台自動化，n8n 都適合拿來做概念驗證與內部工具。

在這個應用裡，n8n 不只是「把 LINE 接到 AI」而已。n8n 比較像一個可以看得見每一步的中控台：LINE 傳來什麼、哪些欄位要轉換、OpenAI Assistant 回傳什麼、最後回覆格式是不是 LINE API 接受的 JSON，都可以在節點裡逐步調整。

## n8n 串接 LINE Bot 前需要準備哪些憑證？

n8n 串接 LINE Bot 前，需要 LINE Developers 帳號、Messaging API Channel、Channel ID、Channel Secret 與 Channel access token。若要接收使用者訊息，也要設定 Webhook URL。

準備 LINE API 憑證的基本步驟如下：

1. 前往 [LINE Developers](https://developers.line.biz/) 註冊或登入帳戶。
2. 建立一個新的 Messaging API Channel。
3. 記下 Channel ID、Channel Secret 和 Channel access token，這些資料會用於 n8n 或 HTTP Request 節點的認證設定。
4. 如果需要接收 LINE 的事件通知，將 n8n 提供的 Webhook URL 設定回 LINE Developers。

LINE Messaging API 的 Webhook 機制，是 LINE Platform 在使用者傳訊息、加入好友或觸發事件時，用 HTTPS POST 把事件送到開發者設定的 Webhook URL（LINE Developers，存取日期：2026-08-28）。正式測試前，記得確認 LINE Developers 裡的 Webhook 已啟用，LINE 官方帳號後台也沒有用預設自動回應蓋掉機器人的回覆。

## 如何在 n8n 中接收 LINE 訊息？

在 n8n 中接收 LINE 訊息，可以先用 Webhook 或 LINE 相關節點接住 LINE 事件，再把使用者文字整理成後續 AI 節點需要的欄位。後續節點通常會讀取 \`chatInput\` 作為使用者問題。

在 n8n 裡新增 LINE 節點後，可以先確認兩個畫面：n8n 的節點設定畫面，以及 LINE Bot 的 channel 設定畫面。這一步先不急著串 AI，先讓 LINE 事件能穩定進到 n8n。

我自己的做法是先用最小流程測試：

1. 使用手機傳一則文字訊息給 LINE 官方帳號。
2. 在 n8n execution 裡確認 LINE 事件是否進來。
3. 找到使用者文字與 \`replyToken\` 在 JSON 裡的位置。
4. 再用 Edit Fields 節點整理後續 AI 節點要吃的欄位。

這裡最容易卡住的地方，不是 AI 回答，而是 LINE 事件 JSON 很深。後面要回覆 LINE 時會需要 \`replyToken\`，要呼叫 AI 時會需要使用者輸入文字；先把這兩個欄位找出來，後面會省很多時間。

## 如何用 OpenAI Assistant 建立 RAG 知識機器人？

OpenAI Assistant 可以先建立專屬知識機器人，並上傳檔案作為 RAG 問答資料。這是 2025 年常見的做法；新專案應先確認 OpenAI 目前推薦的 Responses API 流程。

可以前往 OpenAI 平台的 Assistant 相關頁面建立機器人：

[https://platform.openai.com/playground/assistants](https://platform.openai.com/playground/assistants)

在這個案例裡，我建立的是一個了解我的書籍內容的機器人。當時的 OpenAI Assistant 可以上傳檔案，讓機器人有自己的知識資料來源；使用者從 LINE 問問題時，Assistant 就能根據這些資料回答，而不是只靠模型本身的通用記憶。

RAG（Retrieval-Augmented Generation，檢索增強生成）適合用在「回答必須貼近指定文件」的場景。比起把全部資料寫進提示詞，RAG 會先從知識資料中檢索相關內容，再交給模型產生回答，對書籍問答、內部文件客服、產品知識庫都很實用。

## 如何在 n8n 呼叫已建立好的 OpenAI Assistant？

n8n 呼叫 OpenAI Assistant 時，可以選擇與 Assistant 對話的 AI 節點，並指定剛剛建立好的機器人。若 n8n 節點已改版，請改用目前支援 Responses API 的節點或 HTTP Request。

這一步的重點有兩個：

1. 在 n8n 裡選擇可以和已建立 Assistant 對話的節點。
2. 把前面 LINE 事件整理出的使用者文字，放到 AI 節點需要的 \`chatInput\`。

如果前一個節點的欄位結構不是 AI 節點預期的格式，就先新增一個 Edit Fields 節點，把資料轉成乾淨的結構。這個小步驟很重要，因為 n8n 的節點通常不是只看「畫面上有文字」，而是會讀指定欄位名稱。

我會把資料流整理成這樣：

| 流程位置 | 欄位重點 | 用途 |
|---|---|---|
| LINE Webhook 事件 | 使用者訊息、\`replyToken\` | 接收問題與準備回覆 |
| Edit Fields 節點 | \`chatInput\` | 轉成 AI 節點要讀的輸入 |
| OpenAI Assistant 節點 | \`output\` | 取得 RAG 回答 |
| HTTP Request 節點 | LINE reply body | 把 AI 回答送回 LINE |

## 如何用 LINE Reply API 回覆使用者訊息？

LINE Reply API 需要 \`replyToken\`、\`messages\` 陣列與 Channel access token。當 n8n 取得 OpenAI Assistant 的回答後，可以用 HTTP Request 節點送出 reply message。

原本 n8n 裡有 notify 類型的 LINE 元件，但相關元件可能會因版本更新而變動。比較穩的做法，是直接參考 LINE Messaging API 的 reply message 格式，用 HTTP Request 節點呼叫 API。

LINE 官方文件提供的 reply message 範例如下：

\`\`\`bash
curl -v -X POST https://api.line.me/v2/bot/message/reply \\
-H 'Content-Type: application/json' \\
-H 'Authorization: Bearer {channel access token}' \\
-d '{
    "replyToken":"nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
    "messages":[
        {
            "type":"text",
            "text":"Hello, user"
        },
        {
            "type":"text",
            "text":"May I help you?"
        }
    ]
}'
\`\`\`

在 n8n 裡，\`replyToken\` 需要換成 LINE Webhook 事件裡的實際 token，\`text\` 則換成 OpenAI Assistant 回傳的回答。LINE reply token 只能用於回覆該次事件，所以不要把 reply message 延遲太久才送出。

## 為什麼 LINE 回覆內容要用 JSON.stringify？

OpenAI Assistant 回傳的文字可能包含換行、引號或特殊符號，直接塞進 JSON 會造成格式錯誤。n8n 回覆 LINE 時，用 \`JSON.stringify(...)\` 包住輸出字串，可以降低 JSON body 被打壞的機率。

我在 HTTP Request 節點會把 body 寫成這樣：

\`\`\`js
{
    "replyToken":"{{ $('If').item.json.body.events[0].replyToken }}",
    "messages":[{"type":"text","text":{{ JSON.stringify($json.output) }}}]
}
\`\`\`

這段設定做了兩件事。第一，\`replyToken\` 從前面判斷節點的 LINE 事件中取出；第二，\`messages[0].text\` 使用 \`JSON.stringify($json.output)\`，把 AI 回答轉成合法 JSON 字串。

如果沒有做 \`JSON.stringify(...)\`，AI 回答裡只要有雙引號、換行或部分特殊字元，就可能讓 HTTP Request 節點送出不合法的 JSON。這種錯誤看起來會像 LINE API 不收資料，但根因其實是 request body 在 n8n 端已經壞掉。

## 完整工作流應該長什麼樣？

完整工作流可以拆成 LINE 事件接收、欄位整理、OpenAI Assistant 問答、LINE Reply API 回覆四段。先讓每一段單獨成功，再串成完整 RAG AI 應用。

一個可測試的 n8n + LINE Bot + RAG AI 工作流，可以用這個順序檢查：

1. LINE 使用者傳訊息給官方帳號。
2. LINE Webhook 把事件送到 n8n。
3. n8n 取出使用者文字與 \`replyToken\`。
4. Edit Fields 節點建立 \`chatInput\`。
5. OpenAI Assistant 節點用 RAG 知識回答問題。
6. HTTP Request 節點呼叫 LINE Reply API。
7. 使用者在 LINE 收到 AI 回覆。

我會建議先用一個非常小的知識檔案測試，例如一本書的章節摘要或一份 FAQ。確定 \`chatInput\`、Assistant 回答、LINE reply body 都正常後，再增加資料量與例外處理。這樣比較容易知道問題到底出在線路、憑證、AI 節點，還是 JSON 格式。

## 測試 n8n LINE Bot RAG AI 應用時要檢查什麼？

n8n LINE Bot RAG AI 應用測試時，不只要看 LINE 有沒有回話，也要確認回答是否引用正確知識、錯誤時是否可追蹤、金鑰是否安全保存。

我會用這份檢查表跑第一輪：

| 檢查項目 | 怎麼看 | 常見問題 |
|---|---|---|
| LINE Webhook | n8n execution 是否收到事件 | Webhook URL 貼錯、Use webhook 未開啟 |
| 使用者輸入 | \`chatInput\` 是否有文字 | LINE JSON 路徑抓錯、Edit Fields 設定錯 |
| Assistant 回答 | \`output\` 是否符合知識內容 | 檔案未上傳、Assistant 選錯、問題超出資料範圍 |
| LINE 回覆 | 使用者是否收到訊息 | \`replyToken\` 失效、Authorization header 錯誤 |
| JSON 格式 | HTTP Request body 是否合法 | 忘記使用 \`JSON.stringify(...)\` |
| 安全性 | 金鑰是否只存在後台或環境變數 | Channel access token 或 API key 被貼進公開文件 |

第一次測試時，我會只讓自己或少數測試者加入 LINE 官方帳號。RAG 類型應用很容易在「可回覆」之後才發現「回答不穩」，所以測試題目要包含知識庫內問題、知識庫外問題、長句問題與含特殊符號的問題。

## 常見問題

### n8n 可以不用寫程式就串接 LINE Bot 嗎？
可以，n8n 可以用視覺化節點完成大部分 LINE Bot 串接流程。不過如果要自己呼叫 LINE Reply API，仍需要理解 HTTP header、JSON body、\`replyToken\` 與 access token 的位置。

### n8n LINE Bot 一定要用 OpenAI Assistant 嗎？
不一定。OpenAI Assistant 曾經適合快速建立檔案型 RAG 問答；以 2026 年 8 月 28 日之後的新專案來說，應優先確認 OpenAI Responses API 與 File Search。若團隊已經有自己的向量資料庫、RAGFlow、Dify 或 LlamaIndex，也可以讓 n8n 改呼叫那些服務的 API。

### LINE replyToken 和 Channel access token 差在哪？
\`replyToken\` 是 LINE 針對單次使用者事件產生的回覆 token，用來回覆該次訊息。Channel access token 是 LINE Bot 呼叫 Messaging API 的授權憑證，用在 HTTP \`Authorization\` header。

### 為什麼 n8n 呼叫 LINE Reply API 會回傳錯誤？
常見原因是 \`replyToken\` 路徑抓錯、Channel access token 無效、HTTP header 少了 \`Content-Type: application/json\`，或 request body 不是合法 JSON。若 AI 回答含有換行或引號，請先檢查是否已使用 \`JSON.stringify(...)\`。

### RAG AI 應用可以直接上傳公司內部文件嗎？
不要在沒有確認權限前直接上傳公司內部文件。建立 RAG 知識庫前，應先確認文件是否含個資、客戶資料、合約、醫療資料、財務資料或其他機密內容，並確認 OpenAI 與相關平台的資料處理條款。

### n8n LINE Bot 適合正式上線嗎？
n8n LINE Bot 可以作為內部工具或概念驗證，也可以支撐小規模服務。若要正式上線，建議補上錯誤重試、日誌監控、權限控管、費用上限、資料留存政策與資安審查。

## 參考資料

- n8n, [n8n Documentation](https://docs.n8n.io/)，存取日期：2026-08-28。
- LINE Developers, [Messaging API documentation](https://developers.line.biz/en/docs/messaging-api/)，存取日期：2026-08-28。
- LINE Developers, [Reply message](https://developers.line.biz/en/docs/messaging-api/sending-messages/#reply-messages)，存取日期：2026-08-28。
- OpenAI Platform, [Assistants API deprecation notice](https://platform.openai.com/docs/assistants/overview)，存取日期：2026-08-28。
- OpenAI Platform, [File Search guide](https://platform.openai.com/docs/guides/tools-file-search)，存取日期：2026-08-28。

## 延伸閱讀

- [免程式碼將 ChatGPT 串接到 LINE 對話：FancyAI 與 LINE Bot 設定流程](/post/no-code-chatgpt-line-bot-integration)：同樣聚焦 LINE Bot、Webhook，可接著比較不同情境的做法。
- [Line Bot圖文回覆的幾個功能](/post/line-bot-rich-menu-liff-flex-message)：同樣聚焦 LINE Bot，可接著比較不同情境的做法。
- [LINE Bot 圖文回覆實戰：快速回覆、LIFF、圖文選單與 Flex Message 完整整理](/post/line-bot-rich-menu-liff-flex-message)：同樣聚焦 LINE Bot，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。此次更新將 WordPress 區塊整理為 Markdown，補上 GEO Answer Blocks、測試檢查表、延伸閱讀、FAQ 與參考資料；來源截圖未在 \`markdown-export/uploads\` 或 \`public/images/tech\` 找到完整對應檔，因此本文先使用既有 RAG 示意圖作為封面。
`;export{e as default};