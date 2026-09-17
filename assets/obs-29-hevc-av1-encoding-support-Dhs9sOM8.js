var e=`---
title: OBS 29 新增的編碼支援：HEVC（H.265）推流與 AV1 錄影設定筆記
description: OBS Studio 從 v29 開始支援 HEVC（H.265）推流與 AV1、HEVC 錄影格式。這篇整理編碼器選項怎麼選、有無硬體 GPU 的差異，以及實際設定截圖筆記。
date: 2023-03-13
category: 後端開發
tags: [OBS, HEVC, H.265, AV1, RTMP]
readingTime: 3 分鐘
image: /images/tech/hero_obs-29-hevc-av1-encoding-support.webp
imageAlt: 直播編碼與串流技術概念圖，代表 OBS 的 HEVC 與 AV1 編碼支援
---


# OBS 29 新增的編碼支援：HEVC（H.265）推流與 AV1 錄影設定筆記

OBS Studio 在 v29 版本之後加入了新的編碼支援：除了原本常見的 H.264 之外，現在可以用 HEVC（H.265）透過 RTMP 封裝推流，也能錄製 SVT-AV1、AOM-AV1 和 HEVC 格式的影片。這篇整理我在設定時的觀察與截圖筆記，幫助你快速判斷自己的環境該選哪個編碼器。

## OBS 從哪個版本開始支援 HEVC 推流？

OBS 在 v29 版本之後支援了 HEVC 推流，並且支持利用 RTMP 的封裝方式來推送 H.265 編碼的串流格式。這對原本只能走 H.264 的 RTMP 工作流來說是一大升級——同樣位元率下 HEVC 的畫質明顯更好，或在相同畫質下省下約一半的頻寬。

編碼器的選擇取決於你的硬體：

- **沒有支援硬編碼的 GPU**：CPU 編碼所採取的編碼方案是 QuickSync HEVC（Intel 處理器內顯的硬體編碼單元）。
- **有支援硬編碼的 GPU**：下拉選單會多出該硬體對應的編碼選項，例如 NVIDIA 的 HEVC（NVENC）、AMD 的 HEVC（VCE/AVC）等。

下圖是我在沒有獨立硬編碼 GPU 的機器上看到的設定畫面，編碼方案為 QuickSync HEVC：

![OBS 設定畫面中選擇 QuickSync HEVC 編碼方案](/images/articles/obs-29-hevc-av1-encoding-support-1.webp)

若是電腦有支援硬體編碼的 GPU，則下拉選單會增加該硬體編碼的編碼選項，可以直接選用對應的 HEVC 硬編碼器：

![OBS 設定畫面顯示硬體 GPU 對應的 HEVC 編碼選項](/images/articles/obs-29-hevc-av1-encoding-support-2.webp)

## OBS 29 可以錄製哪些新編碼格式的影片？

除了推流，OBS 29 在錄影端也跟進了新一代編碼格式，可以錄製 **SVT-AV1、AOM-AV1 和 HEVC** 的影片：

- **AV1**：開放、免權利金的下一代編碼格式，壓縮效率比 HEVC 更高，適合追求長期檔案相容性與大小的錄影需求。SVT-AV1 偏速度、AOM-AV1 偏壓縮率，可依機器效能選擇。
- **HEVC**：壓縮效率約為 H.264 的兩倍，錄同一場內容可以省下近一半的磁碟空間。

下圖是錄影編碼格式中出現的 SVT-AV1、AOM-AV1 與 HEVC 選項：

![OBS 錄影格式設定中出現 SVT-AV1、AOM-AV1 與 HEVC 選項](/images/articles/obs-29-hevc-av1-encoding-support-3.webp)

## 該選 HEVC 還是 AV1？怎麼選編碼器？

我的實務建議：

1. **推流（直播）**：先確認接收端（直播平台或自架串流伺服器）是否支援 HEVC over RTMP。若平台尚未支援，退回 H.264 仍是最穩的選擇。
2. **錄影**：錄影只吃本機資源，不用遷就平台，可以大膽試 AV1（SVT-AV1 平衡、AOM-AV1 高壓縮率）；需要與既有後製流程相容時選 HEVC。
3. **硬體優先**：有對應的硬體編碼器（NVENC、QuickSync）就用硬體編碼，CPU 佔用低很多；沒有硬體支援再考慮軟體編碼器。

## 常見問題

### OBS 要更新到哪個版本才能用 HEVC 推流？

OBS Studio v29 之後就加入了 HEVC 推流支援，支援以 RTMP 封裝推送 H.265 串流。若要走更完整的 Enhanced RTMP 規範，建議再升級到 29.1 以上。

### 沒有支援硬體編碼的 GPU 還能用 HEVC 嗎？

可以。沒有可支援硬編碼的 GPU 時，CPU 編碼採取的方案是 QuickSync HEVC；有支援硬編碼的 GPU 時，下拉選單則會增加該硬體對應的編碼選項。

### OBS 29 支援錄製 AV1 影片嗎？

支援。OBS 29 可以錄製 SVT-AV1、AOM-AV1 與 HEVC 三種新編碼格式的影片，其中 SVT-AV1 編碼速度較快、AOM-AV1 壓縮率較高。

### HEVC 和 AV1 該選哪一個？

推流優先看平台與串流伺服器是否支援 HEVC over RTMP；錄影則可以選 AV1 取得更好的壓縮效率。兩者都比 H.264 省頻寬與空間，但播放端與後製工具的相容性要先確認。

## 參考資料

- [OBS Studio 官方網站](https://obsproject.com/)
- [OBS Studio 29 Release Notes](https://github.com/obsproject/obs-studio/releases)

## 延伸閱讀

- [使用 OBS 推流 H.265：v29 後的 HEVC over RTMP 設定筆記](/post/obs-rtmp-h265-streaming)：同樣聚焦 OBS、H.265，可接著比較不同情境的做法。
- [HEVC(H.265) 高壓縮比編碼格式介紹：瀏覽器支援與 RTMP 推流全解析](/post/hevc-codec-introduction)：同樣聚焦 HEVC、H.265，可接著比較不同情境的做法。
- [OBS 推送 HEVC 直播串流到 SRS：Enhanced RTMP 設定教學](/post/obs-hevc-rtmp-srs-streaming)：同樣聚焦 OBS、HEVC，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2023-03-13，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};