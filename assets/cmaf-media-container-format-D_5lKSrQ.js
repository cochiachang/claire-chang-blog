var e=`---
title: CMAF 串流封裝格式介紹：特點、與 HLS/DASH 的關係與延遲問題
description: 介紹 CMAF（Common Media Application Format）媒體封裝格式：單一檔案格式同時支援 HLS 與 MPEG-DASH、切片與無縫切換、支援 H.264/HEVC 編碼與 DRM，以及 CMAF-LLC 低延遲模式與延遲成因分析。
date: 2023-04-25
category: 後端開發
tags: [CMAF, 串流, HLS, MPEG-DASH, 影音編碼]
readingTime: 4 分鐘
image: /images/tech/hero_cmaf-media-container-format.webp
imageAlt: CMAF 通用媒體應用格式透過 HLS 與 DASH 傳輸串流的示意圖
---


# CMAF 串流封裝格式介紹：特點、與 HLS/DASH 的關係與延遲問題

CMAF（Common Media Application Format）是專為網路媒體傳輸設計的媒體封裝格式，最大特點是用單一檔案格式同時適配 HLS 與 MPEG-DASH 兩種串流協議。這篇筆記整理 CMAF 的定義、四大特點（單一格式、切片、編碼效率、DRM 整合），以及它的延遲成因與 CMAF-LLC 低延遲模式的改善方式。

## CMAF 是什麼？

CMAF（Common Media Application Format，通用媒體應用格式）是一種專為網路媒體傳輸設計的標準，也是一種媒體封裝格式，類似於 FLV（Flash Video）和 MP4（MPEG-4 Part 14）。CMAF 旨在簡化在不同裝置和網路環境之間的媒體流適配和交付，從而提高串流的性能和覆蓋範圍。CMAF 檔案通常具有 \`.cmf\` 或 \`.mp4\` 擴展名。

與 FLV 和 MP4 等其他封裝格式相比，CMAF 的一個主要優勢在於它的相容性和靈活性。CMAF 可以應對各種不同的網路環境和裝置能力，並且可以與多種串流協議（如 HLS 和 MPEG-DASH）無縫地配合使用。

## CMAF 有哪些主要特點？

CMAF 的主要特點包括：

1. **單一檔案格式**：CMAF 允許使用單一檔案格式來適配多種串流協議，例如 HLS（HTTP Live Streaming）和 MPEG-DASH（Dynamic Adaptive Streaming over HTTP）。這使得內容提供商能夠更容易地在各種裝置和網路上傳輸和管理媒體內容。
2. **切片**：CMAF 將媒體流切成較小的片段（通常稱為 chunks），這些片段可以在不同品質層次之間進行無縫切換，以適應不同的網路條件和裝置能力。這有助於實現更低的延遲和更高的播放品質。
3. **編碼效率**：CMAF 支援各種編解碼器，例如 H.264（AVC）和 H.265（HEVC），以實現高效的媒體編碼。此外，CMAF 還支援多種音頻編解碼器，例如 AAC 和 Opus。
4. **整合 DRM（數位版權管理）**：CMAF 允許整合各種 DRM 技術，如 Widevine、PlayReady 和 FairPlay，以保護內容的版權。

總之，CMAF 是一種簡化網路媒體傳輸的標準，它有助於提高串流的性能、覆蓋範圍和相容性。

## CMAF 的延遲高嗎？低延遲模式怎麼做？

CMAF 主要用於適配和交付 HLS 和 MPEG-DASH 等串流協議，它的目標是在不同裝置和網路環境之間提供高效的媒體流適配和交付，而非專注於低延遲。

由於 CMAF 依賴於 HTTP，其延遲通常會比使用基於 UDP 的協議（如 SRT 或 RTP）高。HTTP 協議需要較長的時間來建立連接、請求和接收數據，這導致了較大的延遲。此外，**CMAF 通常用於分段媒體流，每個分段的持續時間也會增加延遲。**

不過，CMAF 的延遲性能可以透過使用 CMAF 的低延遲模式（CMAF-LLC）來改善。CMAF-LLC 使用 **chunked encoding** 傳輸技術來實現低延遲，這允許客戶端在接收到完整的媒體分段之前就開始解碼和播放。這樣可以將延遲降低到可接受的範圍，但仍然可能高於使用基於 UDP 的協議，如 SRT。

總結來說，儘管使用 CMAF 的延遲可能較長，但透過 CMAF-LLC 可以改善延遲性能。然而，對於即時應用或低延遲要求非常嚴格的場景，使用基於 UDP 的協議，如 SRT 或 RTP，可能是更合適的選擇。

## 常見問題

### CMAF 是編解碼器還是封裝格式？

CMAF 是媒體封裝格式，不是編解碼器。它類似 FLV 和 MP4，負責把影音打包成分段；內部可以承載 H.264、H.265（HEVC）等視訊編碼與 AAC、Opus 等音訊編碼。

### CMAF 和 HLS、MPEG-DASH 是什麼關係？

CMAF 是封裝格式，HLS 和 MPEG-DASH 是串流協議。CMAF 設計成單一檔案格式可同時被 HLS 和 DASH 使用，內容提供商不必為兩種協議各自準備一份媒體檔案。

### CMAF 的延遲為什麼比 SRT 或 RTP 高？

因為 CMAF 走 HTTP 傳輸，建立連接、請求與接收數據的時間較長，且分段（segment）的持續時間本身就會增加延遲。SRT、RTP 這類基於 UDP 的協議在低延遲場景下表現更好。

### 什麼是 CMAF-LLC？

CMAF-LLC 是 CMAF 的低延遲模式，使用 chunked encoding 傳輸技術，讓客戶端在還沒收到完整分段時就能開始解碼播放，能把延遲降到可接受的範圍。

## 參考資料

本文整理自個人實作筆記。

## 延伸閱讀

- [AV1 影片編碼介紹：高壓縮比、WebRTC 與影音格式比較](/post/av1-video-codec-introduction)：同樣聚焦 影音編碼、串流，可接著比較不同情境的做法。
- [影音服務介紹：點播、直播、錄播的差異與直播串流原理](/post/video-streaming-service-introduction)：同樣聚焦 串流、HLS，可接著比較不同情境的做法。
- [TCP/UDP 協議中的串流協定整理：RTP、RTSP、SRT、QUIC、RTMP 與 HLS](/post/tcp-udp-streaming-protocols)：同樣聚焦 串流，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-04-25，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};