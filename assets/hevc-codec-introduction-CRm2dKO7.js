var e=`---
title: HEVC(H.265) 高壓縮比編碼格式介紹：瀏覽器支援與 RTMP 推流全解析
description: HEVC（H.265）是高壓縮比影片編碼格式，相同畫質下比 H.264 省約一半位元速率，適合 4K 影音與直播串流。本文介紹 HEVC 的壓縮原理、專利授權議題、硬體解碼支援與實際應用情境。
date: 2023-03-13
category: 後端開發
tags: [HEVC, H.265, 影音編碼, RTMP, WebRTC]
readingTime: 5 分鐘
image: /images/tech/hero_hevc-codec-introduction.webp
imageAlt: 深色螢幕上帶有藍色與紫色片段的影片剪輯時間軸
---


# HEVC(H.265) 高壓縮比編碼格式介紹：瀏覽器支援與 RTMP 推流全解析

HEVC（High Efficiency Video Coding，H.265）是 H.264 的後繼編碼標準，能在同樣畫質下減少 50% 以上的比特率。這篇文章整理了 HEVC 的壓縮原理、各瀏覽器的支援現況、用 WebAssembly 補齊支援的播放器方案，以及透過 OBS 與 RTMP 推送 HEVC 串流的實務筆記。

## HEVC(H.265) 是什麼？為什麼壓縮效率比 H.264 高？

HEVC（High Efficiency Video Coding），也稱為 H.265，是一種先進的視頻編解碼標準，是 H.264/MPEG-4 AVC 的後繼者。相較於 H.264，HEVC 可以提供更高的視頻質量、更少的碼率和更高的壓縮效率。

HEVC 採用更高級的壓縮算法，主要透下列幾種方式實現更高的壓縮比：

- 增加更多的預測模式
- 增加更多的參考幀
- 使用更高級別的變換和量化技術

在同樣的視頻質量下，HEVC 可以減少 50% 以上的比特率。

## HEVC 支援哪些解析度與內容類型？

HEVC 支持分辨率高達 8192x4320 的超高清視頻，可以處理各種類型的視頻內容，包括高速運動、低比特率和高動態範圍內容。HEVC 還可以支持多種顏色空間、高級色彩映射和多視點視頻。

由於壓縮效率高，可以在更低的比特率下提供更高的視頻質量，因此 HEVC 被廣泛用於高清和超高清視頻的傳輸和存儲，例如藍光光盤、在線視頻流媒體、視頻會議等。

## 瀏覽器對 HEVC 的支援現況如何？

下圖整理了各主流瀏覽器對 HEVC 的原生支援情況：

![各主流瀏覽器對 HEVC 編碼支援情況的比較截圖](/images/articles/hevc-codec-introduction-1.webp)

若有不支援的瀏覽器，只要該瀏覽器支持 WebAssembly，就可以透過 WebAssembly 來實現解碼的部分，達成軟解播放。

利用 WebAssembly 達成全平台 HEVC 播放的播放器有：

- EasyPlayer.js（以 WebAssembly 實現跨平台 HEVC 播放的播放器之一）
- [h265web.js — 適配瀏覽器 HEVC 硬解碼](https://github.com/numberwolf/h265web.js)

## 推流端如何透過 RTMP 推送 HEVC？

OBS 在版本 29 之後增加了新的編碼支持（H.265 及 AV1），所以現在可以透過 OBS 來推送 HEVC 格式的流了。

不過要注意的是，FLV 規範本身不支持 HEVC(H.265)/AV1，FFmpeg 社區對 FLV 的新視頻編碼算法 CodecID 也沒有新增定義支持，騰訊視頻雲 T-FFmpeg（騰訊視頻雲的 FFmpeg 維護版本）正在推動社區支持封裝/解封 H.265/AV1 的 FLV 補丁。目前國內各直播 CDN 廠商基本支持 H.265 的封裝和解封，而騰訊視頻雲則針對 FLV 支持 AV1 進行了一系列優化。

## 什麼是 go2rtc？可以把串流轉成 WebRTC 嗎？

[go2rtc](https://github.com/AlexxIT/go2rtc) 是一個可以把所有封裝格式的串流轉為 WebRTC 格式的工具。因為 WebRTC 是非常低延遲的封裝格式，這個工具很適合需要低延遲播放的場景。

但目前 WebRTC 對 H.265 的支持仍不高，支援情況如下表：

![WebRTC 各平台對 HEVC(H.265) 支援情況的比較表截圖](/images/articles/hevc-codec-introduction-2.webp)

以 Safari 為例，可以透過以下方式啟用 WebRTC 的 H.265 codec：

- 英文版：Develop > Experimental Features > WebRTC H265 codec
- 中文版：開發 > 實驗性功能 > WebRTC H265 codec

![Safari 啟用 WebRTC H265 codec 實驗性功能的設定畫面截圖](/images/articles/hevc-codec-introduction-3.webp)

## 常見問題

### HEVC 和 H.264 差在哪裡？

HEVC 是 H.264 的下一代標準，透過更多預測模式、更多參考幀和更進階的變換量化技術，在同樣畫質下可減少 50% 以上的比特率，但編碼運算成本也更高。

### 哪些瀏覽器原生支援 HEVC？

以 2023 年的觀察，Safari 對 HEVC 的支援最完整，Chrome/Edge 依硬體解碼能力有限支援，Firefox 則不支援；不支援的瀏覽器可以靠 WebAssembly 軟解補齊。

### FLV 容器可以裝 HEVC 嗎？

標準 FLV 規範不支援 HEVC，需要像騰訊 T-FFmpeg 這類擴充補丁才能封裝/解封 H.265 的 FLV；目前國內直播 CDN 廠商大多已支援 H.265 FLV。

### WebRTC 可以播 H.265 吗？

目前 WebRTC 對 H.265 的支援仍不高，Safari 需要手動在實驗性功能中開啟「WebRTC H265 codec」。

### 什麼是 go2rtc？

go2rtc 是一個開源工具，可以把各種封裝格式的串流轉為低延遲的 WebRTC 格式，方便在瀏覽器做低延遲播放。

## 參考資料

- [h265web.js — 適配瀏覽器 HEVC 硬解碼（GitHub）](https://github.com/numberwolf/h265web.js)
- [go2rtc（GitHub）](https://github.com/AlexxIT/go2rtc)
- [FLV 支持 H.265/AV1 的擴展與騰訊 T-FFmpeg 補丁說明（CSDN）](https://blog.csdn.net/karamos/article/details/103508790)

## 延伸閱讀

- [OBS 29 新增的編碼支援：HEVC（H.265）推流與 AV1 錄影設定筆記](/post/obs-29-hevc-av1-encoding-support)：同樣聚焦 HEVC、H.265，可接著比較不同情境的做法。
- [使用 OBS 推流 H.265：v29 後的 HEVC over RTMP 設定筆記](/post/obs-rtmp-h265-streaming)：同樣聚焦 H.265、HEVC，可接著比較不同情境的做法。
- [為 SRS6 編譯支援 HTTP-FLV 的 FFmpeg：H.265 over RTMP 推流實作](/post/srs6-ffmpeg-http-flv-compile)：同樣聚焦 H.265、RTMP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-03-13，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};