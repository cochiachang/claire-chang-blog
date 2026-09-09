var e=`---
title: MSE（Media Source Extensions）介紹
description: 什麼是 MSE（Media Source Extensions）？本文介紹這個 W3C 網頁 API 標準如何用 JavaScript 動態生成媒體流，實現無插件的網頁串流播放，包含主要功能、應用場景、JavaScript 範例程式碼，以及 Safari 17.1 為 iPhone 帶來的 Managed Media Source API（MSS）支援。
date: 2024-09-23
category: 前端開發
tags: [MSE, Media Source Extensions, HTML5 媒體播放, 自適應比特率流, iPhone MSE 支援]
readingTime: 7 分鐘
image: /images/tech/hero_mse-media-source-extensions-introduction.webp
imageAlt: 網頁影片串流播放示意圖
---


# MSE（Media Source Extensions）介紹

媒體源擴展（Media Source Extensions, MSE）是一項由 W3C 制定的網頁 API 標準，讓開發者能用 JavaScript 動態生成和控制媒體流，實現無插件、純 Web 的流媒體播放。這篇文章整理 MSE 的核心功能、應用場景、實際使用的 JavaScript 範例，以及 iPhone 上 MSE 支援的最新進展（Safari 17.1 的 Managed Media Source API）。

## 什麼是 MSE？它能解決什麼問題？

媒體源擴展（Media Source Extensions, MSE）是一項由 W3C 制定的網頁 API 標準，旨在通過 JavaScript 動態生成和控制媒體流，從而實現無插件且基於 Web 的流媒體播放功能。MSE 允許開發者將媒體數據源附加到 HTMLMediaElement（如 \`<audio>\` 和 \`<video>\` 標籤），並動態地為這些元素構建媒體源。

## MSE 的主要功能有哪些？

- **動態媒體流構建**：MSE 允許開發者使用 JavaScript 動態地創建和控制媒體流，這意味著可以根據需要動態加載和播放媒體數據，而不需要預先下載整個文件。
- **自適應比特率流**：MSE 是實現自適應比特率流（如 DASH 和 HLS）的基礎，這些技術允許根據網絡條件自動調整視頻質量，以提供最佳的觀看體驗。
- **多種媒體格式支持**：MSE 支持多種媒體容器和編解碼格式，常見的包括 H.264 視頻編碼、AAC 音頻編碼和 MP4 容器格式。

## MSE 的應用場景

- **點播影片**：MSE 可以用於點播影片服務，允許使用者在觀賞過程中動態加載不同解析度的影片片段，以適應不同的網路狀況。
- **直播影片**：MSE 也支援直播影片流，雖然在即時性要求較高的應用中（例如視訊通話），MSE 可能不如 WebRTC 那麼合適。
- **自訂媒體播放**：開發者可以利用 MSE 建立自訂的媒體播放器，實現更靈活的控制與功能，例如自訂緩衝策略及錯誤處理機制。

## MSE 的優勢

- **動態加載**：MSE 允許根據需要動態加載媒體數據，減少了初始加載時間和帶寬消耗。
- **自適應流媒體**：MSE 支持自適應比特率流媒體技術，如 MPEG-DASH 和 HLS，提供更好的用戶體驗。
- **高效緩衝管理**：開發者可以精細控制緩衝區，實現更高效的媒體播放。

## 如何使用 MSE？（含 JavaScript 範例）

### 1. 確認瀏覽器支援度

可以使用以下 JavaScript 進行檢查：

\`\`\`js
if ('MediaSource' in window) {
    console.log('MSE is supported');
} else {
    console.log('MSE is not supported');
}
\`\`\`

### 2. 創建 MediaSource 對象

創建一個 \`MediaSource\` 對象並將其附加到 \`<video>\` 元素上：

\`\`\`html
<video id="videoElement" controls></video>
<script>
    var video = document.getElementById('videoElement');
    var mediaSource = new MediaSource();
    video.src = URL.createObjectURL(mediaSource);
<\/script>
\`\`\`

### 3. 處理 sourceopen 事件

\`\`\`js
mediaSource.addEventListener('sourceopen', function() {
    var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    fetchAndAppendSegments(sourceBuffer);
});
\`\`\`

### 4. 獲取和附加媒體片段

使用 \`fetch\` API 或其他方法來獲取媒體片段，並將其附加到 \`SourceBuffer\` 中：

\`\`\`js
function fetchAndAppendSegments(sourceBuffer) {
    fetch('path/to/video/segment.mp4')
        .then(response => response.arrayBuffer())
        .then(data => {
            sourceBuffer.appendBuffer(data);
        });
}
\`\`\`

### 5. 處理緩衝更新

\`\`\`js
sourceBuffer.addEventListener('updateend', function() {
    if (mediaSource.readyState === 'open') {
        fetchAndAppendSegments(sourceBuffer);
    }
});
\`\`\`

## MSE 的瀏覽器支持度如何？

各瀏覽器對 MSE 的支援狀況可以直接查詢 [caniuse](https://caniuse.com/mediasource)。

![MSE 瀏覽器支援度一覽](/images/articles/mse-media-source-extensions-introduction-1.webp)

一直以來，有低延遲需求的高分發直播需求都會很困擾 iPhone 對 MSE 的不支援。

但是好消息！

## Safari 17.1 為 iPhone 帶來 Managed Media Source API

蘋果公司的 Safari 17.1 更新為 iPhone 帶來了新的 Managed Media Source API（MSS），這是 Media Source Extensions（MSE）的進化版本，旨在提供更好的電池效能和網絡優化（參考：[Radiant Media Player 的文章](https://www.radiantmediaplayer.com/blog/at-last-safari-17.1-now-brings-the-new-managed-media-source-api-to-iphone.html)）。

Safari 17.1 的更新標誌著蘋果對 iPhone 的 Managed Media Source API 支持，這是一項長期以來由流媒體行業所期待的功能。MSS 是 MSE 的進化，旨在提供更高效的流媒體體驗，並且在 iOS 上的支持意味著現有的視頻播放器需要從 MSE 遷移到 MSS。MSS 允許瀏覽器更多地控制流媒體的邏輯和設備能力檢測，這些以往由視頻應用程序處理。蘋果強調 MSS 在電池消耗和網絡效率方面的優勢，尤其是在 5G 網絡下。儘管如此，蘋果仍然建議在 Safari 中僅支持蘋果設備的開發者優先使用原生 HLS。Radiant Media Player 已在測試 MSS 的過程中，並計劃添加對 iPhone Safari 中 MSS 的支持，同時保留原生 HLS 作為蘋果設備上的首選方案。

## 常見問題

### 什麼是 MSE（Media Source Extensions）？

MSE 是 W3C 制定的網頁 API 標準，允許開發者透過 JavaScript 動態生成媒體流並附加到 \`<video>\`、\`<audio>\` 元素上。它讓網頁可以在不使用外掛的情況下實現串流播放。

### MSE 和 WebRTC 有什麼差別？

MSE 適合點播與一般直播串流，延遲通常在秒級；WebRTC 則針對超低延遲的即時通訊場景（如視訊通話），延遲可低至數百毫秒。若應用需要極致即時性，WebRTC 通常是更合適的選擇。

### iPhone 支援 MSE 嗎？

iPhone 上的 Safari 長期不支援標準 MSE，這對低延遲直播是很大的困擾。從 Safari 17.1 開始，蘋果為 iPhone 帶來了進化版的 Managed Media Source API（MSS），在電池與網路效率上表現更好，現有播放器需要從 MSE 遷移到 MSS。

### 如何用 JavaScript 檢查瀏覽器是否支援 MSE？

只要檢查 \`window\` 物件中是否存在 \`MediaSource\`：\`if ('MediaSource' in window)\`。支援則回傳 true，可以在MDN 或 caniuse 查詢各瀏覽器的詳細支援狀況。

### MSE 支援哪些媒體格式？

MSE 支援多種媒體容器與編解碼格式，最常見的是 H.264 視頻編碼、AAC 音頻編碼搭配 MP4 容器格式。實際支援會依瀏覽器與裝置而異，建議使用 \`MediaSource.isTypeSupported()\` 檢查。

## 參考資料

- [Can I use — Media Source Extensions](https://caniuse.com/mediasource)
- [At last! Safari 17.1 now brings the new Managed Media Source API to iPhone — Radiant Media Player](https://www.radiantmediaplayer.com/blog/at-last-safari-17.1-now-brings-the-new-managed-media-source-api-to-iphone.html)

## 延伸閱讀

- [OSMF 簡介：用開源框架建置多媒體播放器](/post/osmf-introduction)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。
- [OSMF相關資源整理](/post/osmf-related-resources)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。
- [RWD 響應式網頁開發：CSS Media Queries 實作心得](/post/rwd-media-queries-css)：同屬「前端開發」主題，可延伸理解相近問題的判斷方式。

## 最後更新

2026-08-28（原文發布於 2024-09-23，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};