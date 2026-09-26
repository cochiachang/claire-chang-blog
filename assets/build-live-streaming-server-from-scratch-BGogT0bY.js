var e=`---
title: 從零架設直播伺服器
description: 從零架設直播伺服器的完整思路：RTMP 推流、nginx-rtmp 與 SRS 串流媒體伺服器、HLS 與 WebRTC 播放協定取捨，到 OBS 實測與效能調校的實戰筆記。
date: 2021-11-27
category: 後端開發
tags: [直播伺服器, RTMP, SRS, nginx-rtmp, WebRTC]
readingTime: 6 分鐘
image: /images/tech/hero_build-live-streaming-server-from-scratch.webp
imageAlt: 攝影棚內正在錄製現場活動的專業攝影機，象徵直播訊號的源頭
---


# 從零架設直播伺服器

這篇文章整理我分享過的一場技術演講「從零架設直播伺服器」的重點：從直播的整體架構出發，說明推流與播放協定的選擇、如何用 nginx-rtmp 或 SRS 搭起串流媒體伺服器、怎麼用 OBS 實際推流驗證，以及上線前要注意的延遲與擴充問題。如果你正準備自架直播伺服器，這篇可以當作一份檢查清單。

## 自架直播伺服器要解決什麼問題？

用 YouTube、Twitch 這類平台開直播最省事，但總會遇到需要自己掌控的場景：內容不適合放上公有平台、想自訂播放器與畫面、需要內網或專線環境的低延遲直播，或單純想把流量與觀看數據握在自己手裡。這時就得自己架一台串流媒體伺服器，負責三件事：

1. **接收推流**：讓 OBS、FFmpeg 這類編碼端把影音流推上來。
2. **轉發與轉封裝**：把推進來的流分發給多個觀眾，或轉成 HLS 等適合播放的格式。
3. **對外服務**：透過 HTTP/WebSocket 對播放器提供穩定的拉流位址。

## 直播架構長什麼樣？

一條完整的直播鏈路大致是：

\`\`\`
攝影機 / 麥克風
   → 編碼端（OBS、FFmpeg，輸出 RTMP）
   → 串流媒體伺服器（nginx-rtmp、SRS）
   → 觀眾端播放（HLS、HTTP-FLV、WebRTC）
\`\`\`

編碼端把畫面壓成 H.264/H.265，用 **RTMP** 推到伺服器；伺服器端視需求原樣轉發（RTMP 拉流）、切成 TS 分片（HLS），或轉成 WebRTC 給需要低延遲的場景。我在這場分享裡搭配的投影片就是沿著這條鏈路，逐段說明每個環節的角色與設定。

## 推流與播放協定怎麼選？

| 協定 | 常見用途 | 延遲 | 備註 |
| --- | --- | --- | --- |
| RTMP | 編碼端推流 | 低（約 1–3 秒） | 業界事實標準，OBS 預設支援 |
| HLS | 大規模分發、App/網頁播放 | 高（約 6–30 秒） | 相容性最好，靠切片換規模 |
| HTTP-FLV | 網頁低延遲播放 | 低（約 2–5 秒） | 需搭配 flv.js |
| WebRTC | 連麥、超低延遲互動 | 極低（小於 1 秒） | 部署與除錯成本較高 |

實務上最常見的組合是「**OBS 用 RTMP 推流，伺服器同時提供 HLS 與 HTTP-FLV 給不同觀眾端**」。如果要做連麥、互動式直播，才需要把 WebRTC 拉進架構。

## 串流媒體伺服器選 nginx-rtmp 還是 SRS？

我在分享中比較過兩個最常用的開源方案：

**nginx-rtmp**：在熟悉的 nginx 上掛模組就能用，設定簡潔，適合小規模直播、轉發與錄影。最大缺點是社群維護步調慢，進階功能（轉碼、叢集）都要自己想辦法。

**SRS（Simple Realtime Server）**：專為直播設計的串流伺服器，原生支援 RTMP、HLS、HTTP-FLV、WebRTC，還內建叢集、轉發、鑑權等生產級功能。如果預期觀眾規模會成長，我會直接選 SRS。

最小可用的 nginx-rtmp 設定大概長這樣：

\`\`\`nginx
rtmp {
    server {
        listen 1935;
        application live {
            live on;
            hls on;
            hls_path /var/www/hls;
            hls_fragment 3;
        }
    }
}
\`\`\`

推流位址就是 \`rtmp://<伺服器IP>/live/<串流金鑰>\`，HLS 播放位址則是 \`http://<伺服器IP>/hls/<串流金鑰>.m3u8\`。詳細的安裝步驟可以看我的〈[CentOS 安裝 nginx-rtmp 模組](/post/install-nginx-rtmp-module-centos)〉。

## 怎麼用 OBS 實測？

架好伺服器後，我用 OBS 做端到端驗證：

1. 在 OBS「設定 → 推流」填入 \`rtmp://<伺服器IP>/live\` 與串流金鑰。
2. 編碼器選硬體編碼（NVENC / Apple VideoToolbox）可大幅降低 CPU 負擔；解析度與位元率依上傳頻寬抓，1080p 常見落在 4500–6000 kbps。
3. 開始推流後，先用 VLC 測 RTMP 拉流、再用瀏覽器測 HLS，確認兩條路都通。
4. 觀察伺服器端的連線數與頻寬，估算單機能撐多少觀眾。

後來我也實測過 OBS 29 之後的 HEVC 推流搭配 SRS，細節記在〈[OBS HEVC + SRS 直播實測](/post/obs-hevc-rtmp-srs-streaming)〉，HEVC 在同畫質下能省下約三到四成頻寬。

## 上線前要注意哪些坑？

- **頻寬是最大成本**：出口頻寬 ≈ 位元率 × 觀眾數，觀眾一多就得考慮 CDN 或多台邊緣節點轉發。
- **防火牆要開對埠**：RTMP 走 1935/TCP，HLS 與 HTTP-FLV 走 80/443，記得兩邊都放行。
- **串流金鑰要保密**：金鑰等於推流密碼，外流會被人搶推垃圾內容；正規做法是在伺服器端加 on_publish 鑑權。
- **監控不能少**：至少盯住連線數、卡頓率與頻寬，出問題時才分得出是推流端、伺服器還是觀眾端的事。

## 分享現場

以下是這場分享的資訊與活動剪影：

![從零架設直播伺服器分享資訊](/images/articles/build-live-streaming-server-from-scratch-1.webp)

![直播伺服器分享活動剪影一](/images/articles/build-live-streaming-server-from-scratch-2.webp)

![直播伺服器分享活動剪影二](/images/articles/build-live-streaming-server-from-scratch-3.webp)

![直播伺服器分享活動剪影三](/images/articles/build-live-streaming-server-from-scratch-4.webp)

## 常見問題

### 自架直播伺服器一定要用 RTMP 嗎？

推流端到伺服器這一段，RTMP 仍是相容性最好的選擇，OBS 與 FFmpeg 都原生支援。播放端則不必拘泥 RTMP，可以視裝置改用 HLS 或 HTTP-FLV。

### nginx-rtmp 和 SRS 該選哪一個？

只是小規模直播或內部用途，nginx-rtmp 簡單夠用。如果需要 WebRTC、叢集擴充或長期營運，SRS 的功能完整度和活躍度都更好，我會直接選它。

### 自架直播延遲可以壓到多低？

RTMP/HTTP-FLV 方案大約 2–5 秒，HLS 依切片長度約 6–30 秒。要壓到 1 秒內需要改用 WebRTC，代價是部署與維運複雜度明顯上升。

### 一台伺服器可以撐多少觀眾？

取決於出口頻寬：例如 1080p 約 5 Mbps，1 Gbps 頻寬理論上約 200 路觀眾。超過單機規模就要靠 SRS 叢集或 CDN 分發。

## 參考資料

- [從零架設直播伺服器（SlideShare 投影片）](https://www.slideshare.net/claire0318/ss-254014082)
- [SRS — Simple Realtime Server](https://github.com/ossrs/srs)
- [nginx-rtmp-module](https://github.com/arut/nginx-rtmp-module)

## 延伸閱讀

- [為 SRS6 編譯支援 HTTP-FLV 的 FFmpeg：H.265 over RTMP 推流實作](/post/srs6-ffmpeg-http-flv-compile)：同樣聚焦 SRS、RTMP，可接著比較不同情境的做法。
- [Windows 編譯支援 HTTP-FLV 的 FFmpeg：OBS 虛擬鏡頭推流到 SRS](/post/compile-ffmpeg-http-flv-windows)：同樣聚焦 RTMP、SRS，可接著比較不同情境的做法。
- [影音服務介紹：點播、直播、錄播的差異與直播串流原理](/post/video-streaming-service-introduction)：同樣聚焦 RTMP，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2021-11-27，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};