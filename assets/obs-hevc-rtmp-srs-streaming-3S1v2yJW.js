var e=`---
title: OBS 推送 HEVC 直播串流到 SRS：Enhanced RTMP 設定教學
description: OBS 29.1 起支援 Enhanced RTMP，可用 HEVC 編碼推流到 SRS 6.0.42+，這篇整理實際設定步驟。
date: 2023-04-18
category: DevOps
tags: [OBS, HEVC, RTMP, SRS, 直播串流]
readingTime: 4 分鐘
image: /images/tech/hero_obs-hevc-rtmp-srs-streaming.webp
imageAlt: OBS Studio 設定視窗中將 Video Encoder 選為 QuickSync HEVC
---
# OBS 推送 HEVC 直播串流到 SRS：Enhanced RTMP 設定教學

原始 RTMP 協定不支援 HEVC、AV1 這類高壓縮格式的視訊，但從 OBS Studio 29.1 開始，OBS 加入了對 Enhanced RTMP 的支援，搭配 SRS 6.0.42 以上版本，現在可以直接用 HEVC 編碼把直播串流推到 SRS 伺服器。這篇記錄實際測試過的設定流程。

## OBS 從哪個版本開始支援 HEVC over RTMP？

OBS Studio 29.1 Beta 版本開始支援 [Enhanced RTMP](https://github.com/veovera/enhanced-rtmp) 規範，這是讓 HEVC、AV1 能透過 RTMP 傳輸的關鍵更新。細節可以參考 OBS 專案的 PR：[Enable AV1, HEVC via RTMP to YouTube](https://github.com/obsproject/obs-studio/pull/8522)。

要推送 HEVC 串流，第一步就是先更新 OBS 到這個版本以上，可以從 [OBS Studio 29.1 Beta Release 頁面](https://obsproject.com/forum/threads/obs-studio-29-1-beta.165547/#post-607617)下載。

## SRS 從哪個版本開始支援 HEVC？

SRS 從 v6.0.42 起支援 HEVC，具體包含：

- RTMP：支援 Enhanced RTMP 規範的 HEVC 傳輸
- Player：升級 mpegts.js 以正確播放 HEVC 串流

Enhanced RTMP 規範文件同樣在 [veovera/enhanced-rtmp](https://github.com/veovera/enhanced-rtmp)。

啟動支援 HTTP-TS 的 SRS 服務指令如下：

\`\`\`bash
./objs/srs -c conf/http.ts.live.conf
\`\`\`

## 如何在 OBS 設定 HEVC 推流到 SRS？

設定步驟本身不複雜，重點是版本要對、Encoder 要選對：

1. 確認 OBS 版本 ≥ 29.1，開啟 **File → Setting**
2. **Stream → Service** 選擇 **Custom…**
3. **Output → Output Mode** 選擇 **Advanced**，接著把 Video Encoder 換成 HEVC（如 QuickSync HEVC，視你的硬體編碼器而定）
4. 點擊 **Start Streaming** 開始推流
5. 到 [SRS console](http://127.0.0.1:8080/console/en_index.html#/streams?port=1985&schema=http&host=127.0.0.1) 確認串流狀態
6. 用 [SRS Player](http://127.0.0.1:8080/players/srs_player.html?vhost=__defaultVhost__&app=live&stream=livestream.flv&server=127.0.0.1&port=8080&autostart=true&schema=http) 預覽畫面

下圖是實際在 OBS 設定畫面中，把 Video Encoder 切換成 HEVC 編碼器的樣子：

![OBS Studio 設定視窗中將 Video Encoder 選為 QuickSync HEVC](/images/tech/hero_obs-hevc-rtmp-srs-streaming.webp)

## 常見問題

### 用 HEVC 推流一定要換硬體編碼器嗎？

不一定，只要你的顯示卡或 CPU 有支援 HEVC 硬體編碼（如 QuickSync、NVENC），選擇對應的編碼器即可；沒有硬體支援時,也可以選用軟體 HEVC 編碼器，但會吃比較多 CPU 資源。

### SRS 播放端一定要用 SRS Player 嗎？

不是,只要播放端支援 mpegts.js 且版本已升級到能解析 HEVC,理論上也能整合進自己的網頁播放器,SRS Player 只是官方提供的現成測試工具。

## 參考資料
1. Veovera Software Organization，Enhanced RTMP 規範文件，說明 HEVC、AV1 等現代編碼格式如何透過 RTMP 傳輸，存取日期：2026-08-27。[https://github.com/veovera/enhanced-rtmp](https://github.com/veovera/enhanced-rtmp)
2. SRS（Simple Realtime Server）官方文件，Getting Started 章節，說明 SRS 的推流、播放與各協定設定方式，存取日期：2026-08-27。[https://ossrs.io/lts/en-us/docs/v6/doc/getting-started](https://ossrs.io/lts/en-us/docs/v6/doc/getting-started)

## 延伸閱讀

- [使用 OBS 推流 H.265：v29 後的 HEVC over RTMP 設定筆記](/post/obs-rtmp-h265-streaming)：同樣聚焦 OBS、HEVC，可接著比較不同情境的做法。
- [OBS 29 新增的編碼支援：HEVC（H.265）推流與 AV1 錄影設定筆記](/post/obs-29-hevc-av1-encoding-support)：同樣聚焦 OBS、HEVC，可接著比較不同情境的做法。
- [Windows 編譯支援 HTTP-FLV 的 FFmpeg：OBS 虛擬鏡頭推流到 SRS](/post/compile-ffmpeg-http-flv-windows)：同樣聚焦 RTMP、OBS，可接著比較不同情境的做法。
`;export{e as default};