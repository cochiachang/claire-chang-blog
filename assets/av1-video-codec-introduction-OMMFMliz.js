var e=`---
title: AV1 影片編碼介紹：高壓縮比、WebRTC 與影音格式比較
description: 說明 AV1 是什麼、和 H.264、HEVC、VP9、WebM 的差別，以及直播、會議與播放器支援要注意什麼。
date: 2023-03-13
category: 後端開發
tags: [AV1, 影音編碼, WebRTC, OBS, FFmpeg, 串流]
readingTime: 10 分鐘
image: /images/tech/hero_av1-video-codec-introduction.webp
imageAlt: AV1 video format 的瀏覽器支援狀態截圖
about: [AV1, 高壓縮比編碼, WebRTC, 影音格式比較, 直播串流]
---


# AV1 影片編碼介紹：高壓縮比、WebRTC 與影音格式比較

AV1 是一種開放、免權利金取向的高壓縮比影片編碼格式，適合用在網路影片、串流平台、WebRTC 視訊會議與高解析度內容傳輸。我的使用判斷是：AV1 很適合頻寬成本敏感、畫質要求高、播放環境可控的場景；如果要追求最保守的相容性，仍要準備 H.264 或 HEVC 作備援。

## AV1 是什麼？

<div class="answer">
<p>AV1 是 Alliance for Open Media 開發的開放影片編碼格式，目標是在相同畫質下降低檔案大小與串流頻寬。AV1 常被拿來和 H.264、HEVC/H.265、VP9 比較。</p>
</div>

AV1 的全名是 AOMedia Video 1。AOMedia 將 AV1 定義為開放影片 codec，設計目標是以比前一代 codec 更高的效率提供高品質壓縮，並支援 4K、8K、HDR 與 adaptive streaming 等現代影音需求（AOMedia，存取日期：2026-08-28）。

我會把 AV1 放在兩個脈絡裡理解：第一，AV1 是 VP9 之後更進一步的高壓縮比編碼；第二，AV1 是 HEVC/H.265 的重要競爭者，尤其在 Web、瀏覽器、開放標準與授權成本敏感的產品裡更常被討論。

![AV1 video format 的瀏覽器支援狀態截圖](/images/tech/hero_av1-video-codec-introduction.webp)

## AV1 為什麼適合高壓縮比影片？

<div class="answer">
<p>AV1 適合高壓縮比影片，原因是 AV1 在編碼工具、區塊切分、預測與熵編碼上比舊格式更細。代價是 AV1 編碼通常更吃 CPU 或更依賴硬體加速。</p>
</div>

高壓縮比編碼的核心不是「把影片壓小」這麼簡單，而是在同樣可接受畫質下，用更少 bitrate 表達更多畫面資訊。AV1 規格包含 open bitstream unit（OBU）、多種 profile、level、tile、frame reference 與 film grain synthesis 等機制，讓編碼器可以更細緻地描述影像結構（AOMedia AV1 Specification，2023-05）。

實務上我會先分清楚兩件事：AV1 是 codec，不是容器；MP4、WebM、FLV 才是容器。播放失敗時不要只看副檔名，要確認容器裡面到底封裝了什麼 codec、音訊格式、profile、level 與色彩格式。

## AV1 和 H.264、HEVC、VP9、WebM 有什麼差別？

<div class="answer">
<p>AV1 是影片編碼，WebM 是影音容器，H.264、HEVC/H.265、VP9 則是常見比較對象。選格式時要同時看壓縮效率、授權、硬體支援、瀏覽器支援與播放端相容性。</p>
</div>

下面是我在做網頁影片、直播與會議系統時會用的比較方式：

| 格式 | 類型 | 優勢 | 主要限制 | 我會怎麼用 |
|---|---|---|---|---|
| AV1 | 影片 codec | 壓縮效率高、開放、適合 Web 與高解析度內容 | 編碼成本較高，舊設備硬體支援不一定完整 | 新網頁影片、WebRTC、平台可控的串流 |
| H.264/AVC | 影片 codec | 相容性最高，舊設備與播放器支援穩 | 壓縮效率較舊，頻寬成本較高 | 必備 fallback、商務交付、保守直播 |
| HEVC/H.265 | 影片 codec | 壓縮效率佳，Apple 生態與硬體支援成熟 | 授權與 Web 相容性要確認 | iOS/macOS、4K 影片、特定硬體路線 |
| VP9 | 影片 codec | 開放、Web 支援成熟，常見於 WebM | 壓縮效率通常不如 AV1 | WebM 影片、透明素材、AV1 前一代方案 |
| WebM | 容器格式 | 適合 Web，可封裝 VP8、VP9、AV1、Opus | 不是所有播放與後製流程都最友善 | 網頁播放、搭配 MP4 fallback |

這張表也是我的資訊增益：影音格式決策不要從「哪個格式最新」開始，而要從播放端和工作流開始。若影片會被下載、丟進剪輯軟體、傳給外部客戶，H.264/MP4 仍是最低摩擦的交付格式；若影片留在自家網站、App 或 WebRTC 場景，AV1 才更容易把壓縮效率變成實際收益。

## SVT-AV1 和 AOM-AV1 要怎麼選？

<div class="answer">
<p>SVT-AV1 和 AOM-AV1 都是 AV1 編碼器。SVT-AV1 偏向高效能與可擴展編碼實作，AOM-AV1 則常作為 AOMedia 參考實作與相容性基準。</p>
</div>

SVT-AV1 是 Scalable Video Technology for AV1，現在由 AOMediaCodec 維護，專案頁也標示主要 canonical repository 在 GitLab（AOMediaCodec/SVT-AV1，存取日期：2026-08-28）。AOM-AV1 則通常指 libaom 裡的 AV1 編碼與解碼實作，是很多相容性測試和標準實作討論的基礎。

舊文裡我把 SVT-AV1 和 AOM-AV1 放在一起比較，這個方向仍然有用，但現在我會改用「用途」來選：

| 需求 | 優先考慮 |
|---|---|
| 需要穩定驗證 AV1 bitstream 與標準相容性 | AOM-AV1 / libaom |
| 需要大量轉檔、伺服器批次編碼或較好的速度取捨 | SVT-AV1 |
| 需要瀏覽器或 WebRTC 端即時通訊 | 先看瀏覽器、硬體與 WebRTC stack 支援 |
| 需要直播推流 | 先確認 OBS、SRS、RTMP/WHIP/WebRTC 與播放器端支援 |

![SVT-AV1 與 AOM-AV1 編碼器比較截圖](/images/tech/av1-svt-aom-encoder-comparison.webp)

## AV1 SVC 是什麼？

<div class="answer">
<p>AV1 SVC 是 AV1 的可伸縮影片編碼能力，可把同一段影片分成時間或空間層。會議系統可依網路與裝置能力轉發不同層級，而不必為每個人重新編碼。</p>
</div>

SVC 是 Scalable Video Coding，可把影片分成不同時間層或空間層。時間層常用來調整幀率，空間層常用來調整解析度；接收端可以只取需要的層級，弱網路使用者拿低層級，高頻寬使用者拿高層級。

AOMedia 的 AV1 RTP Payload Format 說明，AV1 over RTP 適用範圍從低 bitrate 點對點傳輸到高 bitrate 多方會議，並包含 temporal 與 spatial scalability 的規劃（AOMedia RTP Payload Format For AV1，2024-12）。這也是 AV1 在 WebRTC 會議裡值得注意的地方：重點不是單一畫質多漂亮，而是多方會議裡能不能有效轉發、降級與恢復。

## AV1 為什麼適合 WebRTC 會議和螢幕共享？

<div class="answer">
<p>AV1 適合 WebRTC 會議，是因為 AV1 能用較低頻寬維持可用畫質，並支援螢幕共享與可伸縮傳輸。真正上線仍要看瀏覽器版本、CPU、硬體編碼與會議架構。</p>
</div>

Chrome 90 開始在桌面版加入針對 WebRTC 視訊會議最佳化的 AV1 encoder。Chromium Blog 當時列出的效益包括更好的壓縮效率、低頻寬下可用的視訊，以及相較 VP9 更好的螢幕共享效率（Chromium Blog，2021-03）。

後續 Chrome Open Media 團隊也針對 libaom 做即時通訊效能改善，讓 Chrome 113 之後的 WebRTC 應用可以使用更快的 AV1 software encoder；Google Meet 也測試過極低頻寬條件下的 AV1 視訊通話（Chrome for Developers，2023-05）。

我的實務提醒是：會議系統導入 AV1 不只是換 codec。會議端還要考慮端到端加密（E2EE）、RTP header extension、SVC layer 轉發、CPU 使用率、硬體加速，以及不能支援 AV1 的參與者要如何 fallback 到 H.264 或 VP9。

## OBS、SRS 和 RTMP 可以怎麼支援 AV1？

<div class="answer">
<p>OBS 與 SRS 支援 AV1 時，重點在 Enhanced RTMP、WebRTC 或平台特定推流流程。AV1 推流前要確認推流端、伺服器、封裝格式與播放器四段都支援。</p>
</div>

OBS 專案在 2023 年合併了「Enable AV1, HEVC via RTMP to YouTube」相關 pull request，讓 AV1、HEVC 能透過 Enhanced RTMP 路線推到支援平台（OBS Project GitHub，2023-03）。SRS 也曾在 v4.0.91 相關 PR 中加入 Chrome M90 WebRTC AV1 支援（SRS GitHub，2021-04）。

騰訊雲文件則提供了直播 AV1 編碼與 AV1 播放流程，包含 AV1 推流與播放端改造注意事項（Tencent Cloud，存取日期：2026-08-28）。不過我在設計直播架構時不會只看「某一端支援 AV1」就決定上線，因為整條鏈路都要成立：

1. 推流端是否能即時編碼 AV1。
2. 傳輸協定是否支援 AV1 bitstream 與 metadata。
3. 串流伺服器是否能正確接收、轉封裝或轉發。
4. 播放器與瀏覽器是否能解碼。
5. 不支援 AV1 的設備是否有 H.264、HEVC 或 VP9 fallback。

## AV1 播放端要注意哪些相容性？

<div class="answer">
<p>AV1 播放端要同時確認播放器、瀏覽器、作業系統、硬體解碼與容器格式。AV1 檔案能不能播，不能只用副檔名或單一播放器支援表判斷。</p>
</div>

App 端常見選項包含 AndroidX Media3 ExoPlayer，以及整合 FFmpeg/dav1d 的播放器路線。Web 端則常見 dash.js、Shaka Player、HTML5 \`<video>\` 與 MSE 組合；PC 端可用 VLC 作為測試播放器。這些播放器名稱看起來像答案，但真正決定相容性的仍是「播放器版本、解碼器、容器與目標設備」。

我會用這份檢查表排 AV1 播放問題：

| 檢查項目 | 要確認什麼 |
|---|---|
| codec | 影片是否真的是 AV1，不是副檔名誤判 |
| container | AV1 放在 MP4、WebM、FLV 或其他容器時，播放器是否支援 |
| audio codec | 音訊是 Opus、AAC 或其他格式，是否與容器相容 |
| browser / player | 目標版本是否支援該組合 |
| hardware decode | 高解析度或行動裝置是否有硬體解碼 |
| fallback | 不支援 AV1 時是否提供 H.264/MP4 或其他備援 |

AV1 的工程風險通常不是規格本身，而是鏈路裡某一段以為自己支援，實際上只支援特定容器、特定 profile 或特定硬體。

## 什麼情況我會選 AV1？

<div class="answer">
<p>我會在頻寬成本高、播放環境可控、畫質重要或 WebRTC 場景考慮 AV1。若專案需要最大相容性、即時低延遲且設備混雜，H.264 仍是必要備援。</p>
</div>

我的 AV1 決策框架很簡單：

| 問題 | 適合 AV1 的答案 |
|---|---|
| 影片主要在哪裡播放？ | 自家網站、現代瀏覽器、可控 App、WebRTC 會議 |
| 影片量是否大到在意頻寬？ | 大量觀看、CDN 成本明顯、長影片或高解析度 |
| 編碼時間是否可接受？ | 可離線轉檔、可用硬體加速、可排程批次處理 |
| 播放端是否混雜？ | 若混雜，要準備 H.264/MP4 fallback |
| 是否需要直播？ | 要逐段驗證 OBS、伺服器、協定與播放器 |

如果只能留一句，我會這樣判斷：AV1 適合「平台能控制播放環境」的影音產品，不適合作為「丟給任何人都一定能播」的唯一格式。這不是 AV1 不好，而是影音格式從來不是單點技術決策。

## 常見問題

<div class="answer">
<p>AV1 常見問題集中在定義、相容性、WebM 關係、WebRTC、OBS 推流與播放器支援。先分清楚 codec、container、協定與播放器，排查速度會快很多。</p>
</div>

### AV1 是什麼格式？
AV1 是 AOMedia Video 1，是一種開放影片編碼格式。AV1 負責壓縮影像資料，不等於 MP4、WebM 或 FLV 這類容器格式。

### AV1 和 WebM 有什麼關係？
AV1 是 codec，WebM 是容器。WebM 可以封裝 AV1 視訊，也可以封裝 VP8、VP9、Opus 或 Vorbis；所以看到 \`.webm\` 副檔名時，仍要確認裡面的 codec。

### AV1 和 HEVC/H.265 哪個比較好？
AV1 和 HEVC/H.265 都是高壓縮比影片編碼。AV1 的優勢在開放標準與 Web 生態，HEVC/H.265 則在部分硬體、Apple 生態與既有 4K 影音流程裡更常見。

### AV1 適合直播推流嗎？
AV1 可以用於直播推流，但要確認推流端、傳輸協定、伺服器與播放器都支援。若觀眾設備混雜，仍建議準備 H.264 或 HEVC 備援。

### OBS 可以推 AV1 嗎？
OBS 可在支援版本與平台條件下使用 AV1 推流，尤其是搭配 Enhanced RTMP 或特定平台支援時。實際可用性仍取決於 OBS 版本、硬體編碼器、推流平台與接收端。

### AV1 適合 WebRTC 視訊會議嗎？
AV1 很適合 WebRTC 視訊會議討論，因為 AV1 對低頻寬與螢幕共享有明顯吸引力。正式導入仍要確認瀏覽器、CPU、硬體加速、SVC 與端到端加密架構。

### AV1 播放失敗要先查什麼？
AV1 播放失敗時，先用工具確認實際 codec、container、profile、level 與 audio codec。接著再查播放器或瀏覽器是否支援這一組格式，而不是只看副檔名。

### AV1 編碼速度慢怎麼辦？
AV1 編碼速度慢時，可以改用 SVT-AV1、調整 preset、降低解析度或使用硬體編碼。若是即時直播或會議，編碼速度比極致壓縮率更重要。

## 參考資料

- Alliance for Open Media, [AV1 Video Codec](https://aomedia.org/specifications/av1/)（存取日期：2026-08-28）
- Alliance for Open Media, [AV1 Bitstream & Decoding Process Specification](https://aomediacodec.github.io/av1-spec/)（最後修改：2023-05-25，存取日期：2026-08-28）
- Alliance for Open Media, [RTP Payload Format For AV1](https://aomediacodec.github.io/av1-rtp-spec/)（Final Deliverable：2024-12-15，存取日期：2026-08-28）
- AOMediaCodec, [SVT-AV1 Repository](https://github.com/AOMediaCodec/SVT-AV1)（存取日期：2026-08-28）
- Chromium Blog, [Chrome 90 Beta: AV1 Encoder for WebRTC, New Origin Trials, and More](https://blog.chromium.org/2021/03/chrome-90-beta-av1-encoder-for-webrtc.html)（發布日期：2021-03-11，存取日期：2026-08-28）
- Chrome for Developers, [Improved video calling with faster AV1 encoding](https://developer.chrome.com/blog/av1)（最後更新：2023-05-02，存取日期：2026-08-28）
- OBS Project GitHub, [Enable AV1, HEVC via RTMP to YouTube](https://github.com/obsproject/obs-studio/pull/8522)（合併日期：2023-03-26，存取日期：2026-08-28）
- SRS GitHub, [RTC: Support av1 for Chrome M90 enabled it](https://github.com/ossrs/srs/pull/2324)（存取日期：2026-08-28）
- Tencent Cloud, [實現直播 AV1 編碼](https://cloud.tencent.com/document/product/267/77789)（存取日期：2026-08-28）
- Tencent Cloud, [播放 AV1 格式視頻](https://cloud.tencent.com/document/product/267/77810)（存取日期：2026-08-28）

## 延伸閱讀

- [OBS 29 新增的編碼支援：HEVC（H.265）推流與 AV1 錄影設定筆記](/post/obs-29-hevc-av1-encoding-support)：同樣聚焦 OBS、AV1，可接著比較不同情境的做法。
- [HEVC(H.265) 高壓縮比編碼格式介紹：瀏覽器支援與 RTMP 推流全解析](/post/hevc-codec-introduction)：同樣聚焦 WebRTC，可接著比較不同情境的做法。
- [串流的網路概念：FFmpeg、WebRTC 與 SRT 在 OSI 模型中的定位](/post/streaming-network-concepts)：同樣聚焦 串流、FFmpeg，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。這次整理保留 AV1、高壓縮比編碼、影音格式比較、SVT-AV1/AOM-AV1、SVC、WebRTC 會議、OBS/SRS 推流與播放端支援脈絡，並補上 GEO Answer Blocks、FAQ、參考資料與站內延伸閱讀。
`;export{e as default};