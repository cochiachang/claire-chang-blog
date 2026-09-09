var e=`---
title: WEBM 影片格式介紹：VP8、VP9、Opus 與瀏覽器支援整理
description: 說明 WebM 是什麼、適合哪些網頁影音情境，以及 VP8、VP9、Opus、瀏覽器支援與轉檔注意事項。
date: 2022-08-02
category: 後端開發
tags: [WebM, VP9, VP8, Opus, HTML5 Video, 影音處理]
readingTime: 8 分鐘
image: /images/tech/hero_webm-video-format-introduction.webp
imageAlt: 電視畫面顯示多個影音串流服務選項，象徵 WebM 在網頁影片播放中的使用情境
---


# WEBM 影片格式介紹：VP8、VP9、Opus 與瀏覽器支援整理

WebM 是為 Web 設計的開放影音容器格式，常用在 HTML5 \`<video>\`、網頁影片、透明背景動畫與串流素材交換。我的使用判斷很簡單：如果影片主要在瀏覽器播放，WebM 很值得列入；如果影片要給最多設備、剪輯軟體或舊系統直接開啟，MP4/H.264 仍然要準備成備援格式。

## WebM 是什麼？

WebM 是開放、免權利金、以網頁播放為目標的媒體格式。WebM 本質上是容器，常見內容是 VP8/VP9 視訊加 Vorbis/Opus 音訊。

WebM Project 將 WebM 定義為專為 Web 設計的開放媒體檔案格式；WebM 檔案結構基於 Matroska 容器，通常封裝 VP8 或 VP9 視訊，以及 Vorbis 或 Opus 音訊（WebM Project，存取日期：2026-08-28）。MDN 也把 WebM 列為現代 Web 常見媒體容器，並說明合規實作需要支援 VP8、VP9、Vorbis 與 Opus（MDN Web Docs，2025-06）。

我會把 WebM 拆成兩層看：\`.webm\` 是外層檔案容器，VP8、VP9、AV1、Opus、Vorbis 才是裡面真正負責壓縮影音資料的 codec。除錯時先分清楚 container 和 codec，會少很多「副檔名明明對，播放器卻不能播」的困惑。

## WebM 支援哪些視訊與音訊編碼？

WebM 常見視訊編碼是 VP8、VP9，也可搭配 AV1；常見音訊編碼是 Opus 與 Vorbis。新專案通常優先考慮 VP9 + Opus。

| WebM 內的 codec | 類型 | 我會怎麼選 |
|---|---|---|
| VP8 | 視訊 | 相容性成熟，適合保守輸出與較舊素材流程 |
| VP9 | 視訊 | 壓縮效率比 VP8 好，適合一般網頁影片與透明影片 |
| AV1 | 視訊 | 壓縮效率更好，但編碼成本與設備支援要另外評估 |
| Opus | 音訊 | 適合語音、音樂與即時通訊，現在是我較常選的 WebM 音訊 |
| Vorbis | 音訊 | 較早期的開放音訊 codec，舊 WebM 文件與素材仍常見 |

MDN 的 \`codecs\` 參數文件列出 WebM 常用 MIME type，例如 \`video/webm;codecs="vp9,opus"\`、\`video/webm;codecs="vp8,vorbis"\` 與 \`audio/webm;codecs="opus"\`（MDN Web Docs，2026-08）。實務上我會在 \`<source>\` 裡寫清楚 codec，讓瀏覽器判斷能不能播放，而不是只丟一個 \`.webm\` 副檔名讓播放器猜。

\`\`\`html
<video controls>
  <source src="/demo.webm" type='video/webm; codecs="vp9,opus"' />
  <source src="/demo.mp4" type='video/mp4; codecs="avc1.42E01E,mp4a.40.2"' />
</video>
\`\`\`

## WebM 和 MP4 要怎麼選？

WebM 適合開放 Web 播放、透明背景與壓縮效率優先的場景；MP4 適合最大設備相容性、剪輯交換與商務交付。

| 使用情境 | 建議格式 | 原因 |
|---|---|---|
| 官網、文件頁、產品 demo 影片 | WebM + MP4 備援 | WebM 省流量，MP4 補足舊環境 |
| 透明背景動畫素材 | WebM VP9 | VP9 可支援 alpha channel，網頁 UI 動畫常用 |
| 剪輯軟體交付或跨部門傳檔 | MP4/H.264 | 多數剪輯軟體、手機與播放器最容易直接開 |
| 即時通訊或 WebRTC | 看平台 codec 支援 | WebRTC 不使用 WebM 容器，而是直接傳音視頻軌 |
| 長期歸檔與後製 | 不只看 WebM | 需要考慮中間格式、色深、音軌與 metadata |

MDN 在網頁影片建議裡，把 WebM + AV1 + Opus 視為開放且免權利金的優先選項，但也提醒 Safari 與較舊 Apple 裝置仍可能影響支援範圍（MDN Web Docs，2026-08）。我的做法通常是：網站前端放 WebM 作第一個 source，再放 MP4 作 fallback。這樣新瀏覽器拿到較省的檔案，舊環境也不至於黑畫面。

## WebM 的瀏覽器支援如何？

截至 2026-08-28，Chrome、Edge、Firefox、Safari 都已支援 WebM 容器與 VP8、VP9、Opus、Vorbis。真正要測的是目標裝置、透明度與特定 codec 組合。

早期整理 WebM 時，我會特別提醒 Safari 支援落差；現在要說得更精準。MDN 的容器支援表顯示 WebM 裡的 VP8、VP9、AV1、Opus 與 Vorbis 在 Chrome、Edge、Firefox、Safari 皆有支援記錄（MDN Web Docs，2025-06）。不過 MDN 的 VP8/VP9 codec 頁面仍提醒，Safari 不支援 VP8/VP9 alpha transparency（MDN Web Docs，2026-08）。

所以我不會只問「Safari 能不能播 WebM」。我會問得更細：使用者的 Safari 版本與作業系統是什麼？WebM 裡是 VP8、VP9 還是 AV1？影片有沒有透明通道？是否需要在 iOS app、社群平台或剪輯軟體裡播放？這些答案比副檔名更接近真實相容性。

## WebM 可以用哪些傳輸方式？

WebM 檔案最常透過 HTTP/HTTPS 傳輸，也可以被放進 DASH 這類串流流程。WebRTC 傳的是媒體軌，不是直接傳 WebM 檔案容器。

一般網站最單純：把 \`.webm\` 放在 CDN 或靜態檔案伺服器，透過 HTTP/HTTPS 給 \`<video>\` 播放。若要做自適應串流，WebM 也可以成為 DASH 流程中的媒體表示之一；HLS 在實務上仍以 MP4/fMP4、H.264、HEVC、AAC 這些組合更常見。

原本筆記裡列過 RTSP、FTP、WebSocket、WebRTC 等傳輸方式，我現在會把它們分開看：FTP 比較像檔案搬運，不是播放協定；WebSocket 可以傳二進位資料，但要自己處理封包、緩衝與播放器；WebRTC 直接傳 \`MediaStreamTrack\`，MDN 明確說 WebRTC 不使用容器格式（MDN Web Docs，2025-06）。如果目標是讓瀏覽器穩定播放，HTTP/HTTPS + \`<video>\` 還是最先考慮的路線。

## WebM 有哪些優點與限制？

WebM 的優點是開放、壓縮效率好、適合網頁播放，也能做透明背景影片。WebM 的限制是後製支援、舊設備與特殊播放環境仍需測試。

WebM 的優點很明確：

- 開放格式：WebM Project 說明 WebM 採開放授權，目標是讓 Web 有高品質、可自由實作的影音格式（WebM Project，存取日期：2026-08-28）。
- 壓縮效率：VP9 通常比 VP8 更適合現代網頁影片，AV1 則可在更高壓縮效率與更重編碼成本之間取捨。
- HTML5 整合：WebM 可直接作為 \`<video>\` 的 source，並透過 MIME type 告訴瀏覽器 codec 組合。
- 透明背景：VP8/VP9 可支援 alpha channel，適合 UI 動畫、角色素材或疊加影片，但 Safari 的 alpha 支援要特別測。

WebM 的限制也要先講清楚：

- 專業剪輯軟體不一定比 MP4/MOV 順手。
- 某些內建播放器、舊手機、企業管控環境仍可能缺 codec。
- 硬體解碼不一定覆蓋所有 VP9/AV1 profile。
- 傳給客戶或非技術同事時，MP4 通常比較不需要解釋。

我的資訊增益放在這裡：WebM 很適合「網站自己控制播放環境」的素材，不適合當成「所有人都會拿去任何地方播放」的唯一交付格式。只要影片會離開瀏覽器，備一份 MP4 幾乎都是便宜的保險。

## 如何用 FFmpeg 轉出 WebM？

FFmpeg 可用 \`libvpx-vp9\` 搭配 \`libopus\` 轉出 WebM。轉檔時要同時確認容器、codec、bitrate/CRF、透明度與 fallback。

最常見的 VP9 + Opus 轉檔可以這樣寫：

\`\`\`bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus output.webm
\`\`\`

如果是短動畫、UI 素材或網頁背景影片，我會先用這個方向試檔案大小，再用瀏覽器實測播放。透明背景影片還要確認輸入是否真的有 alpha channel，以及輸出的 pixel format 和播放端是否支援透明度；不是每一個「看起來是 WebM」的檔案都能保留透明背景。

若只是把圖片轉成 WebP，FFmpeg 也能處理：

\`\`\`bash
ffmpeg -i input.jpg -c:v libwebp output.webp
\`\`\`

WebM 和 WebP 名字很像，但用途不同。WebM 是影音容器，WebP 是圖片格式；兩者都常出現在網站效能優化裡，但不要把圖片轉檔和影片容器混成同一件事。

## Google 還有哪些相關開放媒體技術？

WebM、WebP 與 QUIC 解決的是不同層的問題。WebM 處理影音封裝，WebP 處理圖片壓縮，QUIC 處理傳輸連線效率。

WebP 是圖片格式，可提供有損與無損壓縮，常用來降低網頁圖片體積。WebM 則是影音格式，處理視訊、音訊與容器封裝。QUIC 是傳輸層協定，建立在 UDP 上，用來改善連線建立與弱網路環境下的傳輸表現。

這三個技術常被放在「Google 推動的 Web 效能技術」脈絡裡，但工程上不要混用概念：WebM 決定影片檔怎麼封裝與壓縮；WebP 決定圖片怎麼壓縮；QUIC/HTTP/3 決定資料如何更快、更穩地送到使用者端。

## 常見問題

### WebM 是什麼格式？
WebM 是一種為 Web 設計的開放影音容器格式，副檔名通常是 \`.webm\`。WebM 常封裝 VP8、VP9 或 AV1 視訊，以及 Opus 或 Vorbis 音訊。

### WebM 和 MP4 有什麼差別？
WebM 偏向開放 Web 播放與壓縮效率，常搭配 VP9、AV1、Opus。MP4 則是跨設備與剪輯軟體相容性最穩的通用交付格式，常搭配 H.264 與 AAC。

### WebM 可以在 Safari 播放嗎？
截至 2026-08-28，MDN 顯示 Safari 已支援 WebM 容器、VP8、VP9、AV1、Opus 與 Vorbis。不過 Safari 對 VP8/VP9 透明通道仍有限制，所以透明背景 WebM 必須另外實測。

### WebM 應該用 VP8 還是 VP9？
新素材我通常先選 VP9，因為 VP9 壓縮效率比 VP8 更適合現代網頁影片。若目標環境非常保守，或既有工具鏈只穩定支援 VP8，再考慮 VP8。

### WebM 可以有透明背景嗎？
WebM 可以用 VP8 或 VP9 製作含 alpha channel 的透明背景影片。實務上要同時確認編碼參數、播放器與瀏覽器支援，尤其 Safari 的透明度支援不能只看 WebM 容器支援表。

### WebM 適合直播串流嗎？
WebM 可以用在網頁影音與部分 DASH 流程，但直播常見格式仍取決於平台、協定與播放器。若要做 WebRTC，傳輸的是即時媒體軌，不是把 \`.webm\` 檔案容器直接丟過去。

### WebM 音訊要用 Opus 還是 Vorbis？
新專案我會優先用 Opus，因為 Opus 同時適合語音、音樂與低延遲情境。Vorbis 仍可用，但多數新網頁影音素材沒有必要先選 Vorbis。

### WebM 檔案不能播放時要先檢查什麼？
先檢查 MIME type、codec 字串、瀏覽器版本與檔案內真正的 codec。副檔名是 \`.webm\` 不代表裡面的視訊、音訊組合一定被目標播放器支援。

## 參考資料

- WebM Project, [About WebM](https://www.webmproject.org/about/)（存取日期：2026-08-28）
- MDN Web Docs, [Media container formats (file types)](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Containers)（更新日期：2025-06-10，存取日期：2026-08-28）
- MDN Web Docs, [Codecs in common media types](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/codecs_parameter)（存取日期：2026-08-28）
- MDN Web Docs, [Web video codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs)（存取日期：2026-08-28）
- FFmpeg Project, [FFmpeg Documentation](https://ffmpeg.org/ffmpeg.html)（存取日期：2026-08-28）

## 延伸閱讀

- [AV1 影片編碼介紹：高壓縮比、WebRTC 與影音格式比較](/post/av1-video-codec-introduction)：同屬「後端開發」主題，可延伸理解相近問題的判斷方式。
- [HEVC(H.265) 高壓縮比編碼格式介紹：瀏覽器支援與 RTMP 推流全解析](/post/hevc-codec-introduction)：同屬「後端開發」主題，可延伸理解相近問題的判斷方式。
- [限制 FFmpeg 初始連接的時間：analyzeduration 與 probesize 參數調校](/post/ffmpeg-limit-initial-connection-time)：同樣聚焦 影音處理，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。這次整理補上 GEO Answer Blocks、FAQ、參考資料、瀏覽器支援查證、WebM/MP4 選擇表，以及 AV1、OBS、PyAV、FFmpeg 的站內延伸閱讀。
`;export{e as default};