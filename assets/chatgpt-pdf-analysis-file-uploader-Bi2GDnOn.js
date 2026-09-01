var e=`---
title: "讓 ChatGPT 分析 PDF：Chrome File Uploader 外掛設定教學"
description: 不用 ChatGPT Plus，也能靠 Chrome 外掛讓 ChatGPT 讀取長篇 PDF，並用中文 prompt 逐段餵資料摘要。
date: 2023-12-15
category: 生成式AI
tags: [ChatGPT, PDF分析, Chrome Extension]
readingTime: 5 分鐘
image: /images/tech/hero_claude-code-github-issue.webp
imageAlt: 讓 ChatGPT 分析 PDF：Chrome File Uploader 外掛設定教學 技術文章封面圖
---


# 讓 ChatGPT 分析 PDF：Chrome File Uploader 外掛設定教學

有工具可以讓 ChatGPT 閱讀內容很長的 PDF 檔案，而且不用 ChatGPT Plus 也能使用——讓使用者針對 PDF 的內容發問，ChatGPT 會依照 PDF 的內容來回答。

現在也有人開發了專門處理 PDF 的 GPT，可以直接試試：[AI PDF](https://chat.openai.com/g/g-V2KIUZSj0-ai-pdf)。不過這個工具需要付費的 ChatGPT Plus 才能使用，如果沒有 Plus，可以改用下面的 Chrome 外掛方式。

## 怎麼安裝讓 ChatGPT 讀 PDF 的 Chrome 外掛？

到 Chrome 線上應用程式商店下載 [ChatGPT Sidebar & File Uploader](https://chromewebstore.google.com/detail/becfinhbfclcgokjlobojlnldbfillpf?hl=en-US&utm_source=ext_sidebar) 這個外掛。

啟用之後，ChatGPT 的介面會增加一個上傳檔案的按鈕（非 Plus 用戶也能用）。

## 外掛的行為要怎麼設定？

到 \`chrome://extensions/\` 設定外掛行為。如果沒有另外設定，這個 Sidebar 預設會在每個網站都出現；建議把它限制成只作用在 ChatGPT 這個網站，其餘幾個開關則依個人使用習慣調整即可。

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

## 分段長度要怎麼設定？

分段長度要依你使用的 ChatGPT 版本設定，本質上就是 Token 長度，不能超過模型的長度上限。以下是幾個常見模型的上下文窗口長度，設定分段時可以先估算：

| 特點／模型 | Bard (Google) | ChatGPT (OpenAI) | ChatGPT Plus (OpenAI) | Bing (Microsoft) | Claude (Anthropic) |
|---|---|---|---|---|---|
| 上下文窗口長度 (Token) | 32K | 4K | 8K | 8K | 100K |
| 推理能力 | 不錯 | 最佳 | 最佳 | 不明 | 不錯 |
| 網路連接功能 | 原生支持網路搜尋 | 無法讀取網頁 | 需連至 Bing 取得網頁內容 | 所有用戶可用的連接功能 | 無法讀取網頁 |
| 多模態能力 | 支持文字、圖像、語音輸入 | 無 | 支持圖像、語音及文字輸入，以及圖像、文字、檔案輸出 | 支持文字輸入，圖像、文字輸出 | 支持 PDF 等檔案的文字讀取 |
| 建議用途 | 圖像辨識 | 初次接觸者 | 皆可 | 資訊搜尋 | 長文 PDF 摘要 |
| 費用 | 免費 | 免費 | 每月 $20 美金 | 免費 | 免費 |
| 主要用途 | 研究、資料分析、聊天 | 程式碼開發、聊天 | 多模態及與其他服務的串接應用 | 網路搜尋、聊天 | 研究、分析 |

這張表是當時（2023 年底）的比較，各家模型的上下文長度後續都持續在擴大，實際設定分段長度時建議以你當下使用的模型官方文件為準。

## 常見問題

### 一定要付費才能讓 ChatGPT 讀 PDF 嗎？

不一定。付費的 ChatGPT Plus 版本可以直接用官方的 AI PDF GPT；沒有 Plus 的話，用這篇介紹的 Chrome File Uploader 外掛，一樣可以上傳 PDF 讓 ChatGPT 分析內容。

### 為什麼建議用中文寫分段 prompt？

如果一開始用英文下 prompt，模型回覆容易固定用英文回答，後續即使改用中文提問，效果也會變差。從一開始就用中文下 prompt，整體回答品質會比較穩定。

### PDF 太長一定要分段嗎？

要看你使用的模型上下文長度上限。如果 PDF 內容的 token 數超過模型限制，就必須分段餵資料，並依序使用「第一段」「中間段」「最後一段」對應的 prompt，讓模型知道目前餵入的是文件的哪個部分。

## 參考資料

- [AI PDF（ChatGPT Plus 專用 GPT）](https://chat.openai.com/g/g-V2KIUZSj0-ai-pdf)
- [ChatGPT Sidebar & File Uploader（Chrome 線上應用程式商店）](https://chromewebstore.google.com/detail/becfinhbfclcgokjlobojlnldbfillpf?hl=en-US&utm_source=ext_sidebar)

## 延伸閱讀

- [ChatGPT / Bing / Bard / Claude指南](/post/chatgpt-bing-bard-claude-guide)：同樣聚焦 ChatGPT，可接著比較不同情境的做法。
- [為影片產生會議紀錄及重點擷取：FFMPEG + Word 聽寫 + ChatGPT 完整流程](/post/generate-meeting-notes-from-video)：同樣聚焦 ChatGPT，可接著比較不同情境的做法。
- [讓 ChatGPT 更強大：Zapier AI Actions 串接外部服務教學](/post/chatgpt-zapier-ai-actions)：同樣聚焦 ChatGPT，可接著比較不同情境的做法。

## 最後更新

2026-08-28
`;export{e as default};