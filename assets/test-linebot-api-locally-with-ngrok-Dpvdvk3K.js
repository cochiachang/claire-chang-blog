var e=`---
title: 在本機測試LineBot API
description: 在本機測試LINE Bot API串接不需要部署到HTTPS網址，我分享如何用Ngrok把本地服務暴露到公開網址，解決ERR_NGROK_4018 authtoken驗證錯誤，並將Webhook串接Line Console，在本機直接測試LINE聊天機器人。
date: 2024-10-16
category: 後端開發
tags: [LINE Bot, Ngrok, Webhook, API 測試]
readingTime: 4 分鐘
image: /images/articles/hero_test-linebot-api-locally-with-ngrok.webp
imageAlt: Ngrok官網下載頁面截圖，展示在本機測試LineBot API所需的工具
---


# 在本機測試LineBot API

在本機測試和LINE的API串接時，有幾種方法可以幫助你模擬和測試，而不需要將程式部署到有HTTPS的網址。這篇文章我會分享如何使用Ngrok，把本機運行的服務暴露到互聯網上，讓LINE的Webhook可以直接存取你本機的程式。

## 為什麼在本機測試LineBot API需要Ngrok？

Ngrok是一個免費的命令行工具，可以將你本機運行的服務暴露到互聯網上。這樣，你可以在本機測試你的API，同時讓外部服務（如LINE的Webhook）能夠訪問你的本機服務。ngrok的原理就是可以把外界的請求轉發到你本機指定的Port，也就是由ngrok產生一串公開的網址來讓外網存取你本機上的Port。它的優點是快速而且還提供了https的服務讓你使用上更安全，甚至還可以設置密碼保護。

這個服務在開發Line Bot時非常好用，我們在本機開發webhook的後端程式，當然不想要每次都一定得部屬到伺服器上面才可以測試，使用Ngrok可以擁有一個公開的網址，可以讓其他人直接連上該網址上的內容。

## 如何安裝Ngrok？

可從下面網址下載，下載頁面可選擇平台以及安裝方式：

[https://ngrok.com/download](https://ngrok.com/download)

![Ngrok官網下載頁面，可選擇平台與安裝方式](/images/articles/test-linebot-api-locally-with-ngrok-1.webp)

接著將\`ngrok.exe\`放置在你想要放置的硬碟位置即可。

## 為什麼ngrok會出現ERR_NGROK_4018驗證錯誤？

直接使用下面的指令會出現錯誤訊息 "authentication failed: Usage of ngrok requires a verified account and authtoken."

\`\`\`bash
ngrok http 8080
\`\`\`

查了一下，這是使用ngrok時遇到了身份驗證的問題，具體錯誤是\`ERR_NGROK_4018\`，ngrok需要使用一個已經驗證過的帳戶和authtoken。

這裡有幾個解決步驟：

1. **註冊ngrok帳號**：如果你還沒有ngrok帳戶，請先前往[ngrok註冊頁面](https://dashboard.ngrok.com/signup)進行註冊。註冊完後，確認你的帳號是已驗證的。
2. **取得authtoken**：登入ngrok後，前往[ngrok的authtoken頁面](https://dashboard.ngrok.com/get-started/your-authtoken)，你會看到你的authtoken。這是一串用來驗證你ngrok帳號的密鑰。
3. **安裝authtoken**：在你的命令行或終端中執行以下指令來安裝你的authtoken：\`ngrok config add-authtoken YOUR_AUTHTOKEN\`，請將\`YOUR_AUTHTOKEN\`替換為你從ngrok控制台中取得的authtoken。
4. **重新啟動ngrok**：完成上述步驟後，再次嘗試啟動ngrok，應該就能正常運作。

\`\`\`bash
ngrok config add-authtoken YOUR_AUTHTOKEN
ngrok http 11434
\`\`\`

## 如何把Ngrok的公開網址串接到LineBot？

以下為正常運作的畫面，獲得的公開網址為"https://ab7c-61-219-171-252.ngrok-free.app"

![ngrok正常運作的畫面，顯示轉發到本機Port的公開網址](/images/articles/test-linebot-api-locally-with-ngrok-2.webp)

接著到[Line Console](https://developers.line.biz/console)創建一個LineBot串接到這個公開位置就可以啦！接著就可以在本機測試你的本地端程式了。

![在Line Console的Webhook settings填入ngrok產生的公開網址](/images/articles/test-linebot-api-locally-with-ngrok-3.webp)

## 常見問題

### 為什麼LINE Webhook一定要HTTPS網址？

LINE的Webhook服務規定必須使用HTTPS網址才能接收訊息事件。在本機開發時程式只跑在localhost，透過Ngrok產生的公開HTTPS網址，就能讓LINE的伺服器把請求轉發到你本機。

### Ngrok免費版可以做哪些事？

免費版就足以在本機測試Webhook串接，包含HTTPS網址與請求轉發功能。缺點是每次啟動產生的公開網址會變動，需要重新到Line Console更新Webhook URL。

### 出現ERR_NGROK_4018錯誤該怎麼解決？

這代表尚未設定authtoken。先到ngrok官網註冊並登入，取得你的authtoken後執行\`ngrok config add-authtoken YOUR_AUTHTOKEN\`，再重新啟動ngrok即可正常運作。

## 參考資料

- [快速讓外網連接本機的利器 - Ngrok（Medium）](https://medium.com/%E4%BC%81%E9%B5%9D%E4%B9%9F%E6%87%82%E7%A8%8B%E5%BC%8F%E8%A8%AD%E8%A8%88/%E5%BF%AB%E9%80%9F%E8%AE%93%E5%A4%96%E7%B6%B2%E9%80%A3%E6%8E%A5%E6%9C%AC%E6%A9%9F%E7%9A%84%E5%88%A9%E5%99%A8-ngrok-ac92f792e1f0)

## 延伸閱讀

- [Test LineBot API Locally with Ngrok: A Complete Setup Guide](/post/test-linebot-api-locally-with-ngrok)：同樣聚焦 Ngrok、Webhook，可接著比較不同情境的做法。
- [免程式碼將 ChatGPT 串接到 LINE 對話：FancyAI 與 LINE Bot 設定流程](/post/no-code-chatgpt-line-bot-integration)：同樣聚焦 Webhook，可接著比較不同情境的做法。
- [使用 n8n 與 LINE Bot 搭建 RAG AI 應用](/post/n8n-linebot-rag-ai-application)：同樣聚焦 Webhook，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-10-16，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};