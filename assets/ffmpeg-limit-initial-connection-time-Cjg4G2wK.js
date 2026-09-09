var e=`---
title: 限制 FFmpeg 初始連接的時間：analyzeduration 與 probesize 參數調校
description: FFmpeg 的 analyzeduration 與 probesize 參數決定開檔時的探測耗時，本文說明兩者的預設值、過小的風險，以及如何優化播放器首屏秒開。
date: 2023-06-01
category: 後端開發
tags: [FFmpeg, 串流,影音處理, MP4, 首屏秒開]
readingTime: 4 分鐘
image: /images/tech/hero_ffmpeg-limit-initial-connection-time.webp
imageAlt: 深色伺服器終端機畫面中顯示影片串流處理指令碼，象徵 FFmpeg 媒體分析參數調校
---


# 限制 FFmpeg 初始連接的時間：analyzeduration 與 probesize 參數調校

FFmpeg 打開一個媒體檔案時，會先花時間分析內容、解析格式與編解碼器資訊，這段探測時間直接影響播放器的首屏秒開。這篇文章整理 \`-analyzeduration\` 與 \`-probesize\` 兩個參數的作用、預設值、設定過小的風險，以及搭配 MP4 faststart 做服務端優化的做法。

## analyzeduration 和 probesize 是什麼？

在 FFmpeg 中，\`-analyzeduration\` 和 \`-probesize\` 是用於設置媒體分析的參數。

- \`-analyzeduration\` 參數用於指定分析媒體文件的持續時間。當你在 FFmpeg 中打開一個媒體文件時，它需要一些時間來分析文件的內容，以確定其格式、編解碼器和其他相關的信息。這個參數設置了分析的時間長度。較長的 \`-analyzeduration\` 值可能會導致更準確的分析結果，但同時也會增加打開文件的時間。預設值為 5,000,000 微秒（5 秒）。
- \`-probesize\` 參數用於指定分析媒體文件時讀取的數據大小。當 FFmpeg 分析媒體文件時，它會從文件中讀取一些數據並進行分析。這個參數設置了從媒體文件中讀取的數據大小。較大的 \`-probesize\` 值可能會導致更準確的分析結果，但同時也會增加分析的時間和記憶體使用量。預設值為 50,000 字節。

兩個參數的對照如下：

| 參數 | 控制項目 | 預設值 | 拉大效果 | 調小效果 |
| --- | --- | --- | --- | --- |
| \`-analyzeduration\` | 分析時長（微秒） | 5,000,000（5 秒） | 分析更準確、開檔更慢 | 開檔更快、可能解析不足 |
| \`-probesize\` | 預讀數據量（字節） | 50,000 | 更準確、耗時與記憶體增加 | 更快省資源、可能讀不到關鍵資訊 |

## 為什麼 MP4 的 metadata 位置會拖慢起播？

播放器在網絡點播場景下去請求 MP4 視頻數據，需要先獲取到文件的 metadata，解析出該文件的編碼、幀率等信息後才能開始邊下邊播。如果 MP4 的 metadata 數據塊（moov atom）被編碼在文件尾部，這種情況會導致播放器只有下載完整個文件後才能成功解析並播放這個視頻。

對於這種視頻，我們最好能夠在服務端將其重新封裝，將 metadata 數據塊轉移到靠近文件頭部的位置，保證播放器在線請求時能較快播放。比如 FFmpeg 的下列命令就可以支持這個操作：

\`\`\`bash
ffmpeg -i bad.mp4 -movflags faststart good.mp4
\`\`\`

## 如何控制 avformat_find_stream_info 的耗時來優化首屏秒開？

在外部可以通過設置 \`probesize\` 和 \`analyzeduration\` 兩個參數，控制該函數讀取的數據量大小和分析時長為比較小的值，來降低 \`avformat_find_stream_info\` 的耗時，從而優化播放器首屏秒開。

但是，需要注意的是這兩個參數設置過小時，可能會造成預讀數據不足，無法解析出碼流信息，從而導致播放失敗、無音頻或無視頻的情況。所以，在服務端對視頻格式進行標準化轉碼，從而確定視頻格式，進而再去推算 \`avformat_find_stream_info\` 分析碼流信息所兼容的最小的 \`probesize\` 和 \`analyzeduration\`，就能在保證播放成功率的情況下最大限度地優化首屏秒開。

實務上可以這樣組合：

\`\`\`bash
ffmpeg -analyzeduration 1000000 -probesize 100000 -i input.mp4 -c copy output.mp4
\`\`\`

先在服務端用固定轉碼管線輸出格式一致的影片，再壓低探測參數，是兼顧成功率與秒開的關鍵。

## probesize 和 analyzeduration 設置得太短會有哪些問題？

如果將 \`-probesize\` 和 \`-analyzeduration\` 設置得太短，可能會導致以下問題：

- **不準確的媒體分析**：probesize 和 analyzeduration 參數用於指定媒體分析的數據大小和時間長度。如果這兩個值設置得太短，FFmpeg 可能無法讀取足夠的數據或分析足夠長的時間，從而導致分析結果的不準確性。這可能會影響到媒體文件的正確解碼、格式識別和相關信息的獲取。
- **遺漏關鍵信息**：媒體文件中的關鍵信息通常在文件的早期部分或特定位置。如果 probesize 和 analyzeduration 設置得太短，FFmpeg 可能無法讀取到這些關鍵信息，進而影響解碼、播放或處理過程的正確性和完整性。
- **性能問題**：probesize 和 analyzeduration 參數的值也會影響處理媒體文件所需的時間和資源。如果值設置得太短，FFmpeg 可能需要更頻繁地從媒體文件中讀取數據或進行分析，增加了 I/O 操作和 CPU 負載，進而導致性能下降。

## 常見問題

### analyzeduration 的預設值是多少？

5,000,000 微秒，也就是 5 秒。這是 FFmpeg 打開媒體檔案時分析內容的時間上限，值越大解析越準確，但開檔時間也越長。

### probesize 的預設值是多少？

50,000 字節。這是 FFmpeg 探測階段從媒體文件讀取的數據量上限，設太大會增加分析時間與記憶體使用量。

### 為什麼播放器起播很慢要檢查 MP4 的 moov 位置？

如果 metadata（moov atom）在檔案尾端，播放器必須下載完整個檔案才能解析並開始播放。用 \`ffmpeg -i bad.mp4 -movflags faststart good.mp4\` 把 moov 移到檔頭，即可大幅縮短起播等待。

### 調小 probesize 和 analyzeduration 有什麼風險？

預讀數據可能不足，導致無法解析出碼流資訊，出現播放失敗、無音頻或無視頻的情況。建議先在服務端標準化轉碼固定格式，再推算可用的最小參數值。

### 這些參數對播放器首屏秒開有什麼幫助？

\`avformat_find_stream_info\` 的耗時直接決定播放器多快能拿到編碼與幀率資訊並開始播放。壓低 probesize 與 analyzeduration 可以縮短這段探測時間，配合 faststart 就能在保證播放成功率下優化首屏秒開。

## 參考資料

- 本文整理自 FFmpeg 官方文件中關於 \`analyzeduration\`、\`probesize\` 與 \`movflags\` 選項的說明，以及我實務上優化串流起播時間的筆記。
- 相關筆記：[使用 FFmpeg 濾鏡功能做影片合成](/post/ffmpeg-video-filter-compositing)、[PyAV 如何用 Python 處理 RTMP 串流與透明影片](/post/pyav-video-streaming-examples)

## 延伸閱讀

- [OBS 會議錄影教學：視窗擷取、聲音設定與 FFmpeg 剪輯流程](/post/obs-meeting-recording-guide)：同樣聚焦 FFmpeg、影音處理，可接著比較不同情境的做法。
- [串流的網路概念：FFmpeg、WebRTC 與 SRT 在 OSI 模型中的定位](/post/streaming-network-concepts)：同樣聚焦 串流、FFmpeg，可接著比較不同情境的做法。
- [AV1 影片編碼介紹：高壓縮比、WebRTC 與影音格式比較](/post/av1-video-codec-introduction)：同樣聚焦 FFmpeg、串流，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-06-01，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};