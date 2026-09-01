var e=`---
title: 為影片產生會議紀錄及重點擷取：FFMPEG + Word 聽寫 + ChatGPT 完整流程
description: 把會議錄影影片轉成會議紀錄的完整流程：先用 FFMPEG 將 mp4 轉 mp3，再用 Word 內建聽寫（轉錄）功能擷取文字，最後交給 ChatGPT 修正錯別字、整理成摘要與標題，大幅節省人工謄稿時間。
date: 2023-05-31
category: 生成式AI
tags: [ChatGPT, FFmpeg, 語音轉文字, 會議紀錄, Word聽寫]
readingTime: 3 分鐘
image: /images/tech/hero_generate-meeting-notes-from-video.webp
imageAlt: 筆記本與鍵盤，象徵會議紀錄整理
---


# 為影片產生會議紀錄及重點擷取：FFMPEG + Word 聽寫 + ChatGPT 完整流程

開完會留下錄影檔，卻沒有人力把內容打成會議紀錄？這篇筆記記錄我實際走過的一條低成本自動化路線：用 FFMPEG 把影片抽成 MP3，交給 Word 內建的聽寫（轉錄）功能把語音轉成文字，最後用 ChatGPT 修正錯別字並整理成摘要與標題。全程不用額外花費，只要人力做最後的審核。

## 為什麼要先把影片轉成 MP3？

含影像的檔案比純音檔大得多。後續上傳做語音辨識時，檔案越小、上傳與處理的時間越短，所以第一步我會先把 mp4 抽成 mp3。

先按照[使用 OBS 做會議錄影](/post/obs-meeting-recording-guide)這篇的方式安裝 FFMPEG，接著就可以用 ffmpeg 將影片轉成 mp3 檔案：

\`\`\`bash
ffmpeg -i input.mp4 -vn -acodec libmp3lame output.mp3
\`\`\`

在上述命令中，\`input.mp4\` 是輸入的 MP4 檔案路徑，\`output.mp3\` 是輸出的 MP3 檔案路徑。

## 怎麼用 Word 內建聽寫功能把語音轉成文字？

從語音檔案提取文字，這個功能在 Word 就有了；若是沒有 Word，Google 文件也有相似的聽寫功能。以下是我使用 Office 內建聽寫功能的示範。

先使用轉錄功能：

![Word 開始使用轉錄功能](/images/articles/generate-meeting-notes-from-video-1.webp)

接著選擇輸入語言為台灣國語，並上傳剛剛擷取出來的 mp3 檔案：

![選擇語言並上傳 mp3](/images/articles/generate-meeting-notes-from-video-2.webp)

選擇完檔案會開始上傳 MP3 並且擷取音檔內的文字，這也是為什麼一開始我會希望將 mp4 轉成 mp3——含影像的檔案較大，純音檔較小，上傳較小的檔案這邊所花費的時間會少一點：

![正在上傳並擷取文字](/images/articles/generate-meeting-notes-from-video-3.webp)

當節錄文字完成後，選擇將文字加到檔案內，就會出現如下的語音謄錄文字：

![語音謄錄完成的文字](/images/articles/generate-meeting-notes-from-video-4.webp)

## 為什麼謄出來的文字需要 ChatGPT 再整理？

一直到這邊所產生的文字，都很不容易讓人理解，因為所擷取出的文字很容易會有錯別字。例如「視障小孩」可能會被聽寫成「師丈小孩」，根本意義完全不同，讓人難以理解。

但 ChatGPT 對於理解這樣的錯別字、比對上下文去猜出正確辭意的能力頗強，所以可以把謄出來的文字交給 ChatGPT 請它幫忙整理內容：

![把謄錄文字交給 ChatGPT 整理](/images/articles/generate-meeting-notes-from-video-5.webp)

例如上面的文字，GPT 所整理出的內容如下：

![ChatGPT 整理後的結果](/images/articles/generate-meeting-notes-from-video-6.webp)

接著再重複使用上面產生的內容，請 GPT 產生摘要、標題。我們只需要做內容審核、確認、修正即可，可以大幅節省人力！

## 下指令的技巧：指令會直接影響產出品質

對 ChatGPT 所下的指令會影響到產出。例如上面我使用「順成文章」的指令，結果 ChatGPT 就自己唬爛了一些不相關的內容（什麼「不僅僅是個人問題」之類的，老師根本沒有講）。這時候改使用「順過讓文字更好讀」這樣的指令，就比較不會產生不相關的內容。

建議可以多嘗試幾種不同的指令，直接針對它整理過後不滿意的方向請它重新整理，直到 ChatGPT 給出較滿意的產出後，再自行做驗證與整理。

## 常見問題

### 為什麼要先轉成 MP3 再做語音辨識？

純音檔比含影像的檔案小很多，上傳與處理時間都更短。用 \`ffmpeg -i input.mp4 -vn -acodec libmp3lame output.mp3\` 一行指令就能抽出音訊。

### 沒有 Word 也可以做語音轉文字嗎？

可以。Google 文件也有相似的聽寫功能，另外市面上也有 Whisper 等開源語音辨識工具可以本機執行。差別主要在辨識正確率與操作便利性。

### ChatGPT 為什麼能修正聽寫的錯別字？

語音辨識的錯字通常是同音異字，ChatGPT 能比對上下文猜出正確詞意，例如把誤聽的「師丈小孩」修回「視障小孩」。但它也可能過度延伸，所以最後仍要人工驗證。

### 怎麼避免 ChatGPT 自己編造不存在的內容？

指令越明確越好。我用「順成文章」這種指令時它就自行補寫了不相關內容，改成「順過讓文字更好讀」這種只要求修飾文字的指令就不會亂加東西。不滿意就針對問題請它重整。

### 這個流程適合用在哪些情境？

最適合會議錄影、課程錄音這種「有音檔、沒時間打逐字稿」的場景。整條流程只花人工在最終審核，能把數小時的謄稿工作壓縮到幾分鐘。

## 參考資料

- [使用 OBS 做會議錄影](/post/obs-meeting-recording-guide)
- [ChatGPT](https://chatgpt.com/)
- [FFMPEG 官方網站](https://ffmpeg.org/)

## 延伸閱讀

- [讓 ChatGPT 分析 PDF：Chrome File Uploader 外掛設定教學](/post/chatgpt-pdf-analysis-file-uploader)：同樣聚焦 ChatGPT，可接著比較不同情境的做法。
- [讓 ChatGPT 更強大：Zapier AI Actions 串接外部服務教學](/post/chatgpt-zapier-ai-actions)：同樣聚焦 ChatGPT，可接著比較不同情境的做法。
- [ChatGPT / Bing / Bard / Claude指南](/post/chatgpt-bing-bard-claude-guide)：同樣聚焦 ChatGPT，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-05-31，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};