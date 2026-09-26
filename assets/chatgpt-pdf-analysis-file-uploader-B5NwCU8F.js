var e=`---
title: "讓 ChatGPT 分析 PDF：免費版直接上傳、長文件分段 Prompt 與舊外掛說明"
description: 免費版 ChatGPT 自 2024 年起已能直接上傳 PDF 分析，不用再裝 Chrome 外掛。本文整理現在的上傳做法、掃描檔與超長文件的限制，以及仍然好用的中文分段 prompt。
date: 2023-12-15
category: 生成式AI
tags: [ChatGPT, PDF分析, Chrome Extension]
readingTime: 6 分鐘
image: /images/tech/hero_claude-code-github-issue.webp
imageAlt: 讓 ChatGPT 分析 PDF 的技術文章封面圖
---


# 讓 ChatGPT 分析 PDF：免費版直接上傳、長文件分段 Prompt 與舊外掛說明

現在要讓 ChatGPT 分析 PDF，**直接在對話框上傳檔案就可以了，免費版也能用**，不需要再安裝 Chrome 外掛。這篇文章 2023 年底寫的時候，免費版 ChatGPT 還沒有上傳檔案的功能，所以當時介紹了一個 Chrome 外掛來繞過限制。OpenAI 在 2024 年 5 月推出 GPT-4o 時，把檔案上傳開放給免費用戶，外掛的做法就不再需要了。

不過當時整理的「中文分段 prompt」仍然有用：遇到超長文件、掃描檔，或是要把內容貼進上下文比較短的模型時，還是得自己分段餵資料。

## 現在要怎麼讓 ChatGPT 讀 PDF？

免費版和付費版 ChatGPT 都可以直接上傳 PDF。在對話框點「＋」或迴紋針圖示選擇檔案，上傳後直接用中文提問即可，例如「請用條列整理這份文件的重點」。

OpenAI 在 2024 年 5 月 13 日的公告中，把「上傳檔案讓 ChatGPT 協助摘要、撰寫或分析」列為開放給免費用戶的功能之一，同時開放免費用戶使用 GPT 商店裡的 GPTs（OpenAI，Introducing GPT-4o and more tools to ChatGPT free users）。免費方案有使用次數限制，額度會調整，實際數字以 OpenAI 說明中心的 File Uploads FAQ 為準。

上傳 PDF 前可以先確認這幾件事：

| 檢查項目 | 為什麼重要 |
| --- | --- |
| PDF 是不是文字型 | 用滑鼠能選取文字的是文字型 PDF。整份都是掃描圖片的 PDF，ChatGPT 可能讀不到內文 |
| 檔案有沒有機密資料 | 上傳前先確認公司的資料政策，個資或未公開資料不要直接上傳 |
| 文件是否超長 | 內容太長時，ChatGPT 可能只讀到部分內容，或摘要漏掉後半段 |
| 圖表是不是重點 | OpenAI 的 FAQ 提到，除了企業版以外的方案，PDF 主要擷取文字內容。圖表裡的數字建議另外截圖上傳 |

## 當時的 Chrome 外掛現在還能用嗎？

不建議再用。當時介紹的外掛叫「ChatGPT Sidebar & File Uploader」，作用是在免費版 ChatGPT 介面加上一個上傳按鈕。這個外掛在 Chrome 線上應用程式商店的頁面（ID \`becfinhbfclcgokjlobojlnldbfillpf\`）現在已經改名為「AITOPIA」，變成整合多家 AI 模型的聊天側邊欄，功能和當時不同。

既然 ChatGPT 已經內建上傳功能，就沒有必要額外安裝一個會讀取網頁內容的第三方外掛。如果之前裝過，可以到 \`chrome://extensions/\` 檢查是否還需要，不需要就移除。

同樣地，當時提到的 [AI PDF](https://chat.openai.com/g/g-V2KIUZSj0-ai-pdf) 這個 GPT，當時只有 ChatGPT Plus 能用，現在免費用戶也能使用 GPTs，但一般 PDF 直接上傳就能處理，不一定需要它。

## 什麼時候還需要自己分段餵資料？

大多數情況直接上傳就好。以下三種情況，才需要把 PDF 內容複製出來，分段貼給 ChatGPT：

1. **文件非常長**：例如上百頁的報告，直接上傳後的摘要常常只涵蓋前半部。分段貼入可以確保每一部分都被讀到。
2. **掃描檔或文字擷取有亂碼**：先用 OCR 工具轉成文字、人工校對後，再分段貼入。
3. **要用的模型或工具不支援上傳檔案**：例如某些公司內部的 AI 工具，或是只能輸入文字的 API 串接。

## PDF 內容要怎麼分段餵給 ChatGPT？

建議用中文寫 prompt，不然 ChatGPT 回答容易變成英文，之後用中文提問的效果也會變差；但只要一開始的 prompt 就用中文下，後續回答內容大致上都正確。

我實際用的四段式 prompt 分別對應「單一部分」「多部分的第一段」「多部分的中間段」「多部分的最後一段」：

**Single Part Prompt**（PDF 內容一次餵完時使用）

\`\`\`text
#zh-TW
下面是文件完整的資訊，請幫我做此文件資料的總結
\`\`\`

**Multi Part First Prompt**（PDF 要分段餵時，第一段使用）

\`\`\`text
#zh-TW
我所分享的此份文件會被分成很多個部分，請等待我輸入所有部分，接著再做全部資料的總結，在這之前，請單單回應 "了解，我會等待其餘的部分輸入"
\`\`\`

**Multi Part Consecutive Prompts**（中間每一段重複使用）

\`\`\`text
#zh-TW
這是此份文件分段的其中一部份，請回應"了解，我會等待其餘部分的輸入"
\`\`\`

**Last Part Prompt**（最後一段使用）

\`\`\`text
#zh-TW
這是最後一部分，請仔細地觀看全部的文件，在之後的問題中，回應我這份文件的相關資訊 ，請單單回應 "了解，我會整理從第一部份至最後一部分的資訊"
\`\`\`

分段時的幾個原則：

- **依章節切，不要依字數硬切。** 在句子或表格中間切斷，模型容易誤解內容。
- **每段開頭標上章節名稱或頁碼**，例如「第 3 章，第 21 到 30 頁」，之後問問題時模型比較能指出出處。
- **最後一段貼完後，先請它列出各段重點再提問。** 如果某一段的重點明顯缺漏，代表那一段可能沒有被讀進去，要重新貼一次。

## 分段長度要怎麼設定？

分段長度取決於模型的上下文窗口（context window），也就是模型一次能處理的 token 數。每一段加上 prompt 都不能超過這個上限，而且整份文件的總長度最好也在上限之內，否則前面的段落可能在對話後段被模型「忘記」。

2023 年底寫這篇文章時，我整理過各家模型的上下文長度，當時免費版 ChatGPT 只有 4K token、ChatGPT Plus 是 8K、Claude 是 100K。這些數字現在都已經大幅增加，而且各家模型、各種方案的上限不同，也經常調整，所以這裡不再列出固定數字。實際設定分段長度時，請以你當下使用的模型官方文件為準。

一個簡單的估算方式：中文內容大約每 1 到 2 個字會算成 1 個 token（依模型的斷詞方式而不同）。不確定時，寧可把每段切小一點。

## 常見問題

### 免費版 ChatGPT 可以上傳 PDF 嗎？

可以。OpenAI 從 2024 年 5 月起把檔案上傳開放給免費用戶，直接在對話框上傳 PDF 就能提問。免費方案有使用次數限制，額度以 OpenAI 說明中心公告為準。

### 還需要安裝 Chrome 外掛才能讓 ChatGPT 讀 PDF 嗎？

不需要。本文 2023 年介紹的外掛是為了在免費版加上上傳按鈕，現在 ChatGPT 已經內建上傳功能。原本的外掛頁面也已經改名為 AITOPIA，功能不同，不建議再安裝。

### 為什麼 ChatGPT 讀不到我的 PDF 內容？

最常見的原因是 PDF 是掃描圖片，裡面沒有可擷取的文字。可以先用滑鼠試著選取 PDF 裡的文字，選不到就代表是圖片，需要先用 OCR 轉成文字。

### 為什麼建議用中文寫分段 prompt？

如果一開始用英文下 prompt，模型回覆容易固定用英文回答，後續即使改用中文提問，效果也會變差。從一開始就用中文下 prompt，整體回答品質會比較穩定。

### PDF 太長一定要分段嗎？

不一定。先試著直接上傳，檢查摘要有沒有涵蓋到文件後半段。如果後半段的內容明顯缺漏，或是文件本身超過模型的上下文長度，再改用本文的四段式 prompt 分段貼入。

## 參考資料

- OpenAI. [Introducing GPT-4o and more tools to ChatGPT free users](https://openai.com/index/gpt-4o-and-more-tools-to-chatgpt-free/)（2024-05-13）. 存取日期：2026-09-25。
- OpenAI Help Center. [File Uploads FAQ](https://help.openai.com/en/articles/8555545-file-uploads-faq). 存取日期：2026-09-25。
- [Chrome 線上應用程式商店：原 ChatGPT Sidebar & File Uploader 外掛頁面（現為 AITOPIA）](https://chromewebstore.google.com/detail/becfinhbfclcgokjlobojlnldbfillpf). 存取日期：2026-09-25。
- [AI PDF（GPT 商店）](https://chat.openai.com/g/g-V2KIUZSj0-ai-pdf)

## 延伸閱讀

- [ChatGPT / Bing / Bard / Claude指南](/post/chatgpt-bing-bard-claude-guide)：2023 年各家 AI 聊天工具的比較，可以對照現在的變化。
- [為影片產生會議紀錄及重點擷取：FFMPEG + Word 聽寫 + ChatGPT 完整流程](/post/generate-meeting-notes-from-video)：同樣是把長內容交給 ChatGPT 整理重點的流程。
- [讓 ChatGPT 更強大：Zapier AI Actions 串接外部服務教學](/post/chatgpt-zapier-ai-actions)：讓 ChatGPT 直接讀寫外部服務的資料。

## 最後更新

2026-09-25：免費版 ChatGPT 已可直接上傳檔案，改寫為以內建上傳為主；說明原 Chrome 外掛已改名為 AITOPIA、不建議再使用；新增何時仍需分段餵資料與分段原則；移除 2023 年的過時模型比較表。原文發布於 2023-12-15。
`;export{e as default};