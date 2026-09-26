var e=`---
title: 使用 OBS 推流 H.265：v29 後的 HEVC over RTMP 設定筆記
description: OBS 從 v29 開始支援 HEVC 推流，可以透過 RTMP 封裝推送 H.265 編碼的串流。這篇筆記整理編碼器下拉選單的差異、無 GPU 時的 QuickSync HEVC CPU 編碼方案，以及錄製 SVT-AV1、AOM-AV1 與 HEVC 格式的設定重點。
date: 2023-03-18
category: 後端開發
tags: [OBS, H.265, HEVC, RTMP, 直播推流]
readingTime: 2 分鐘
image: /images/tech/hero_obs-rtmp-h265-streaming.webp
imageAlt: 三腳架上的專業攝影機，背景是粉紫色燈光的直播現場
---


# 使用 OBS 推流 H.265：v29 後的 HEVC over RTMP 設定筆記

OBS 從 v29 之後支援了 HEVC 推流，可以利用 RTMP 的封裝方式推送 H.265 編碼的串流格式。這篇整理我在設定時注意到的編碼器差異：沒有硬編碼 GPU 時走 QuickSync HEVC，有 GPU 時則會多出對應的硬體編碼選項，錄影也一併支援 SVT-AV1、AOM-AV1 和 HEVC。

## OBS v29 之後怎麼推流 H.265？

OBS 也在 v29 版之後支援了 HEVC 推流，支援利用 RTMP 的封裝方式來推送 H.265 編碼的串流格式。也就是說，串流設定裡的視訊編碼器可以直接選 HEVC，不需要額外裝外掛。

若電腦沒有可支援硬編碼的 GPU，其 CPU 編碼所採取的編碼方案是 QuickSync HEVC：

![OBS 沒有支援硬編碼 GPU 時的編碼器選項，採用 QuickSync HEVC](/images/articles/obs-rtmp-h265-streaming-1.webp)

## 有硬編碼 GPU 時差在哪裡？

若是電腦有可支援硬編碼的 GPU，則下拉選單會增加該硬體編碼的編碼選項，例如 NVIDIA NVENC HEVC 等，把編碼工作交給 GPU，CPU 負擔會明顯下降：

![OBS 偵測到支援硬編碼的 GPU 後，下拉選單多出硬體 HEVC 編碼選項](/images/articles/obs-rtmp-h265-streaming-2.webp)

## 錄影格式也支援 AV1 與 HEVC

除了推流，錄影部分也可以錄製 SVT-AV1、AOM-AV1 和 HEVC 格式的影片：

![OBS 錄影編碼器可選 SVT-AV1、AOM-AV1 與 HEVC](/images/articles/obs-rtmp-h265-streaming-3.webp)

## 常見問題

### OBS 從哪個版本開始支援 H.265 推流？

OBS 從 v29 之後開始支援 HEVC（H.265）推流，並支援以 RTMP 封裝的方式推送 H.265 編碼的串流。建議直接升級到 v29 以上版本使用。

### 電腦沒有支援硬編碼的 GPU，還能推 H.265 嗎？

可以。此時 CPU 編碼會採用 QuickSync HEVC 方案，只是編碼負擔會落在 CPU 上。若效能吃緊，可以降低解析度或位元速率來換取流暢度。

### OBS v29 的錄影可以存成哪些新格式？

錄影支援 SVT-AV1、AOM-AV1 和 HEVC 三種格式。要錄 AV1 需在錄影編碼器選擇對應選項，硬體條件允許的話也可以選硬體 HEVC。

## 參考資料

- [OBS Studio 官方網站（版本發布說明）](https://obsproject.com/)
- 系列文章：[OBS 推送 HEVC 直播串流到 SRS](/post/obs-hevc-rtmp-srs-streaming)

## 延伸閱讀

- [OBS 29 新增的編碼支援：HEVC（H.265）推流與 AV1 錄影設定筆記](/post/obs-29-hevc-av1-encoding-support)：同樣聚焦 OBS、HEVC，可接著比較不同情境的做法。
- [OBS 推送 HEVC 直播串流到 SRS：Enhanced RTMP 設定教學](/post/obs-hevc-rtmp-srs-streaming)：同樣聚焦 OBS、HEVC，可接著比較不同情境的做法。
- [HEVC(H.265) 高壓縮比編碼格式介紹：瀏覽器支援與 RTMP 推流全解析](/post/hevc-codec-introduction)：同樣聚焦 HEVC、H.265，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-03-18，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};