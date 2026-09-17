var e=`---
title: WebCodecs + WebGPU：開啟個人化串流新視界
description: 整理 WebCodecs、WebGPU 與 WebAssembly 如何讓瀏覽器處理低延遲串流、逐幀影像與端側 AI。
date: 2024-11-30
category: 前端開發
tags: [WebCodecs, WebGPU, WebAssembly, 串流, 前端開發, Web AI]
readingTime: 9 分鐘
image: /images/tech/hero_webcodecs-webgpu-personalized-streaming.webp
imageAlt: DevFest Taipei 2024 WebCodecs 與 WebGPU 講題活動視覺
---


# WebCodecs + WebGPU：開啟個人化串流新視界

WebCodecs + WebGPU 適合解決「瀏覽器想低延遲播放串流，還想在畫面被渲染前做客製化處理」的問題。WebCodecs 讓前端直接取得解碼後的 \`VideoFrame\` 與 \`AudioData\`，WebGPU 則把影像處理、渲染與部分 AI 推理交給 GPU，讓個人化直播、雲端遊戲、線上會議特效與互動影音不必全部繞回伺服器。

這是我在 DevFest Taipei 2024 分享的主題。過去我做過 H5 網頁遊戲、串流播放器、串流伺服器、OpenCV 影像辨識，也用 TensorFlow、YOLO 做過影像辨識；這場分享想回答的問題很單純：當影音串流進到瀏覽器後，前端能不能不只「播放」，而是更靠近媒體管線本身。

## WebCodecs + WebGPU 想解決什麼問題？

<div class="answer">
<p>WebCodecs + WebGPU 解決的是瀏覽器影音管線過度封裝的問題。前端若要在解碼後、渲染前插入自訂處理，就需要更低階的媒體與 GPU 存取能力。</p>
</div>

傳統網頁影音播放多半交給 \`HTMLMediaElement\`、WebRTC 或 Media Source Extensions（MSE）。這些 API 很好用，適合播放、通訊與 adaptive streaming，但多數細節被瀏覽器封裝起來；開發者很難在 demux、decode、render 之間插入自己的影像處理流程。

如果真的要改畫面，常見做法是先把影片畫到 Canvas，再逐格取出影像修改。這條路能做，但成本很高。一般網路影片大約 30 到 60 FPS，電影常見 24 FPS；每一幀都從播放元素取出、複製、處理、再畫回去，效能壓力很快會浮出來。

MDN 對 MSE 的說明也點出它主要是讓 JavaScript 產生媒體串流給 \`<audio>\` 與 \`<video>\` 播放，並支援像 DASH、HLS 這類串流播放流程；DASH live profile 可能引入延遲，因此不適合取代 WebRTC 做即時通訊（MDN Web Docs，2026-03）。

## 低延遲串流為什麼不能只靠傳統 HLS 或 DASH？

<div class="answer">
<p>低延遲互動串流不能只靠傳統 HLS 或 DASH，因為分段傳輸會帶來緩衝與播放延遲。雲端遊戲、互動劇情與即時特效更需要逐幀處理能力。</p>
</div>

HLS 與 DASH 的基本思路，是把影音切成一段一段的檔案，再由播放器依網路狀況載入。這對大量觀眾、CDN 傳輸與穩定播放很有幫助，但對互動遊戲、即時濾鏡、遠端控制或雲端遊戲來說，延遲就是產品體驗的一部分。

我會把瀏覽器串流需求分成兩種：

| 需求 | 傳統播放 API 是否足夠 | 更適合的方向 |
|---|---|---|
| 一般直播觀看 | 通常足夠 | HLS、DASH、MSE、HTMLMediaElement |
| 視訊會議 | 需要即時通訊能力 | WebRTC |
| 低延遲雲端遊戲 | 單純播放不夠 | WebCodecs、WebGPU、WebTransport 或 RTCDataChannel |
| 即時背景移除與畫質增強 | 單純播放不夠 | WebCodecs 解碼逐幀處理，WebGPU 做渲染或推理 |
| 瀏覽器內轉碼或剪輯 | 單純播放不夠 | WebCodecs 搭配 WebAssembly、Worker、Canvas |

重點不是 HLS 或 DASH 不好，而是「播放穩定」和「逐幀互動」是兩種不同目標。前者追求可擴展、可緩衝、可容錯；後者追求低延遲、可介入、可客製。

## WebCodecs 在串流管線裡負責什麼？

<div class="answer">
<p>WebCodecs 負責讓前端直接處理音訊與視訊的編碼、解碼與逐幀資料。WebCodecs 適合直播、雲端遊戲、媒體編輯與瀏覽器內轉碼。</p>
</div>

WebCodecs 是低階 Web API，讓開發者能以瀏覽器原生能力處理音訊與視訊資料。MDN 將 WebCodecs 定位為可有效率地在瀏覽器中 encode/decode video/audio，並提供 per-frame 低階控制的 API；常見場景包含 browser-based editing、live streaming 與 video conferencing（MDN Web Docs，2026-08）。

WebCodecs 裡幾個重要實體要先分清楚：

| 類型 | 影像 | 聲音 |
|---|---|---|
| 原始資料 | \`VideoFrame\` | \`AudioData\` |
| 編碼後資料 | \`EncodedVideoChunk\` | \`EncodedAudioChunk\` |
| 解碼器 | \`VideoDecoder\` | \`AudioDecoder\` |
| 編碼器 | \`VideoEncoder\` | \`AudioEncoder\` |

在 W3C WebCodecs sample 的 audio-video-player 範例裡，流程是用 demuxer 取出 chunks，交給 \`AudioDecoder\` 與 \`VideoDecoder\` 解碼，再同步音訊與視訊並輸出到播放端。投影片裡我特別放了 \`SharedArrayBuffer\`、Web Worker 與 \`VideoFrame\` / \`AudioData\`，因為真正要穩定處理串流，主執行緒不能塞滿所有工作。

## WebGPU 為什麼適合接在 WebCodecs 後面？

<div class="answer">
<p>WebGPU 適合接在 WebCodecs 後面，因為 WebGPU 可把解碼後的影格送進 GPU 渲染管線。WebGPU 也能支援影像處理與機器學習推理這類平行運算。</p>
</div>

WebCodecs 解碼後拿到的是 \`VideoFrame\`。接下來如果只是用 Canvas2D 每幀繪製，複製與轉換成本會變成瓶頸；如果能直接把 \`VideoFrame\` 匯入 WebGPU，就可以更靠近 GPU 記憶體與渲染管線。

MDN 在 WebCodecs 使用指南中提到，使用 WebGPU 的 \`importExternalTexture()\` 將 \`VideoFrame\` 渲染到 Canvas，是最有效率的方式；這種方式使用同一個 \`VideoFrame\` 物件進入 WebGPU pipeline，但設定也最複雜（MDN Web Docs，2026-08）。

W3C WebGPU Working Draft 對 \`GPUExternalTexture\` 的描述也說明，external texture 是包住外部 video object 的可取樣 2D texture，並透過 \`GPUDevice.importExternalTexture()\` 建立（W3C，2023-03）。投影片中的 video-decode-display 範例就是這條路線：WebCodecs 逐幀解碼，WebGPU 透過 WGSL shader 把外部紋理渲染到 Canvas。

## WebAssembly 在這條管線裡還有角色嗎？

<div class="answer">
<p>WebAssembly 仍然適合放在瀏覽器串流管線裡處理 CPU 型重運算。WebGPU 不會取代 WebAssembly，兩者會依工作負載分工。</p>
</div>

WebAssembly（Wasm）是一種可在瀏覽器中高效執行的二進位格式，常用來把 C/C++、Rust 或既有影音處理函式庫帶到 Web。當工作負載偏小、偏 CPU、或需要既有原生程式碼移植時，WebAssembly 仍然很實用。

Chrome for Developers 在 2024 年 I/O 的 WebAssembly + WebGPU 文章中提到，瀏覽器端 AI 推理可透過 JavaScript、WebAssembly、WebGL 或 WebGPU 執行；WebAssembly 對文字或音訊這類較小工作負載仍有價值，WebGPU 則適合更大的 GPU 平行運算（Chrome for Developers，2024-05）。

我的判斷方式是這樣：

| 工作 | 較適合的技術 |
|---|---|
| 解碼後逐幀取得影像 | WebCodecs |
| 影片濾鏡、畫面合成、GPU shader | WebGPU |
| 既有 C/C++ 函式庫移植 | WebAssembly |
| 小型音訊或文字推理 | WebAssembly 或 JavaScript runtime |
| 大量 tensor 計算、影像模型推理 | WebGPU 或支援 WebGPU 的 ML runtime |

三者不是互斥選項。比較真實的架構會是 Fetch、WebSockets、WebTransport 或 RTCDataChannel 取得資料，demux 後交給 WebCodecs 解碼，影像處理用 JavaScript、WebAssembly 或 WebGPU 分工，最後再渲染到 Canvas。

## 個人化串流可以怎麼落地？

<div class="answer">
<p>個人化串流的落地方式，是在瀏覽器端依使用者情境即時改變畫面。WebCodecs 負責取得影格，WebGPU 或 WebAssembly 負責背景模糊、畫質增強、辨識與合成。</p>
</div>

「個人化串流」不是只在播放器外面加 UI。更有趣的地方，是串流內容可以在使用者端被理解、修改與重新呈現：會議背景模糊、即時字幕、影像降噪、畫質增強、人臉辨識、互動影片、雲端遊戲畫面疊加，都屬於這個方向。

投影片裡我放了幾個例子：

- Adobe 使用 TensorFlow.js 強化 Photoshop 網頁版。
- Google Meet 曾加入背景模糊效果。
- Whisper WebAssembly demo 可在網頁中做即時語音辨識。
- MediaPipe Studio 提供多種瀏覽器端 AI 與機器學習範例。
- \`llama.cpp\` 也有在瀏覽器中執行大型語言模型的實驗路線。

這些例子的共通點，是把一部分運算留在使用者裝置上。Chrome for Developers 也指出，browser client 端推理可降低伺服器成本、減少延遲，並讓敏感資料不必送回伺服器（Chrome for Developers，2024-05）。對直播、會議、醫療影像輔助或教育訓練來說，這不只是效能問題，也是隱私與產品設計問題。

## 開發 WebCodecs + WebGPU 管線要注意什麼？

<div class="answer">
<p>開發 WebCodecs + WebGPU 管線時，最容易出問題的是記憶體、執行緒、瀏覽器支援與 codec 相容性。正式上線前必須逐段驗證每一個媒體處理節點。</p>
</div>

WebCodecs 與 WebGPU 都比較接近底層，因此自由度高，責任也會回到開發者手上。MDN 特別提醒，\`VideoFrame\` 可能消耗大量 GPU memory，處理每秒多幀影片時要在不需要後呼叫 \`frame.close()\`，避免記憶體洩漏造成應用程式崩潰（MDN Web Docs，2026-08）。

我會用這份檢查表開始做原型：

| 檢查項目 | 要確認什麼 |
|---|---|
| 傳輸方式 | Fetch、WebSocket、WebTransport 或 RTCDataChannel 是否適合延遲需求 |
| 解封裝 | 瀏覽器端 demuxer 是否支援目標 container，例如 MP4、WebM 或 MPEG-TS |
| codec | H.264、HEVC、AV1、VP9、Opus 是否被目標瀏覽器與硬體支援 |
| threading | 解碼、同步、渲染是否放進 Worker，避免卡住主執行緒 |
| frame lifecycle | \`VideoFrame\` 是否在 encode 或 render 後釋放 |
| GPU pipeline | \`importExternalTexture()\`、shader、bind group 與 render pass 是否逐幀正確更新 |
| fallback | 不支援 WebGPU 或特定 codec 時，是否退回 Canvas、WebGL、MSE 或伺服器處理 |

這份檢查表也是我從串流播放器、串流伺服器與影像辨識經驗裡學到的事：影音問題通常不是單一 API 壞掉，而是傳輸、封裝、解碼、記憶體與渲染其中一段沒有對齊。

## 活動資訊與投影片

<div class="answer">
<p>這場分享是 DevFest Taipei 2024 的 WebCodecs + WebGPU 技術講題。內容聚焦瀏覽器端串流處理、Web AI 與低延遲互動影音。</p>
</div>

活動頁可參考 GDG Taipei 的 DevFest Taipei 2024 頁面：[DevFest Taipei 2024](https://gdg.community.dev/events/details/google-gdg-taipei-presents-devfest-taipei-2024/cohost-gdg-taipei)。

投影片可從站內下載：[WebCodecs + WebGPU：開啟個人化串流新視界](/images/tech/webcodecs-webgpu-personalized-streaming-slides.pdf)。

![WebCodecs + WebGPU DevFest Taipei 2024 講題現場照片](/images/tech/webcodecs-webgpu-devfest-session-1.webp)

![WebCodecs + WebGPU 講題介紹圖](/images/tech/webcodecs-webgpu-devfest-talk-1.jpg)

![DevFest Taipei 2024 WebCodecs + WebGPU 活動剪影](/images/tech/webcodecs-webgpu-devfest-session-2.webp)

![DevFest Taipei 2024 WebCodecs + WebGPU 現場交流照片](/images/tech/webcodecs-webgpu-devfest-session-3.webp)

## 常見問題

<div class="answer">
<p>WebCodecs + WebGPU 的常見問題多半圍繞用途、延遲、瀏覽器支援、WebAssembly 分工與上線風險。先釐清媒體管線，再決定 API 組合。</p>
</div>

### WebCodecs 是什麼？
WebCodecs 是瀏覽器提供的低階影音編碼與解碼 API。WebCodecs 可讓前端拿到 \`VideoFrame\`、\`AudioData\`、\`EncodedVideoChunk\` 與 \`EncodedAudioChunk\`，適合需要逐幀控制的直播、剪輯、轉碼與視訊處理。

### WebGPU 和 WebGL 有什麼差別？
WebGPU 是較新的 Web graphics 與 GPU compute API，設計目標是提供比 WebGL 更現代的 GPU 存取方式。WebGPU 更適合 compute shader、現代渲染管線與機器學習推理這類平行運算。

### WebCodecs + WebGPU 可以取代 WebRTC 嗎？
WebCodecs + WebGPU 不等於 WebRTC。WebRTC 負責低延遲即時通訊與媒體傳輸，WebCodecs + WebGPU 更像是讓瀏覽器端能控制解碼後的影格與渲染流程；實務上三者可以一起使用。

### 為什麼不用 Canvas 逐格處理影片就好？
Canvas 逐格處理影片可以做簡單效果，但每幀擷取、複製、修改與重畫會帶來效能成本。當影片是 30 到 60 FPS，且還要做 AI 推理、濾鏡或低延遲互動時，WebCodecs + WebGPU 更適合承擔高頻率影像處理。

### WebAssembly 和 WebGPU 要怎麼選？
WebAssembly 適合 CPU 型運算、既有 C/C++ 函式庫移植與較小工作負載。WebGPU 適合大量平行運算、影像處理、GPU shader 與大型 tensor 計算；同一個串流產品常會同時使用兩者。

### WebCodecs 支援所有影片格式嗎？
WebCodecs 不保證支援所有 container 與 codec。開發者要分開確認 demuxer、codec、瀏覽器版本、硬體加速與作業系統支援；副檔名能播放，不代表可被 WebCodecs 管線逐幀處理。

### WebGPU 可以用來做瀏覽器端 AI 嗎？
WebGPU 可以支援瀏覽器端 AI 推理，尤其是影像、tensor 與平行運算量大的工作。實務上通常會透過 TensorFlow.js、ONNX Runtime Web、MediaPipe 或其他 runtime 使用 WebGPU，而不是每個專案都手寫完整 GPU compute pipeline。

### WebCodecs + WebGPU 適合哪些產品？
WebCodecs + WebGPU 適合雲端遊戲、低延遲直播、互動影音、線上會議特效、瀏覽器內影片剪輯、即時畫質增強與端側 AI。若只是一般影片播放，\`<video>\`、HLS、DASH 或 MSE 通常更簡單。

## 參考資料

- MDN Web Docs, [WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API)（存取日期：2026-08-28）
- MDN Web Docs, [Using the WebCodecs API](https://developer.mozilla.org/en-US/docs/Web/API/WebCodecs_API/Using_the_WebCodecs_API)（存取日期：2026-08-28）
- MDN Web Docs, [Media Source API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API)（更新日期：2026-03-10，存取日期：2026-08-28）
- W3C, [WebCodecs samples: audio-video-player](https://github.com/w3c/webcodecs/tree/main/samples/audio-video-player)（存取日期：2026-08-28）
- W3C, [WebCodecs samples: video-decode-display](https://github.com/w3c/webcodecs/tree/main/samples/video-decode-display)（存取日期：2026-08-28）
- W3C, [WebGPU Working Draft](https://www.w3.org/TR/2023/WD-webgpu-20230302/)（發布日期：2023-03-02，存取日期：2026-08-28）
- Chrome for Developers, [WebAssembly and WebGPU enhancements for faster Web AI, part 1](https://developer.chrome.com/blog/io24-webassembly-webgpu-1)（發布日期：2024-05-16，存取日期：2026-08-28）
- GDG Taipei, [DevFest Taipei 2024](https://gdg.community.dev/events/details/google-gdg-taipei-presents-devfest-taipei-2024/cohost-gdg-taipei)（存取日期：2026-08-28）

## 延伸閱讀

- [Emscripten 編譯 WebAssembly 實作筆記：從 MSYS2 到 emmake](/post/emscripten-webassembly-compile-guide)：同樣聚焦 WebAssembly、前端開發，可接著比較不同情境的做法。
- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取](/post/insert-flash-in-browser-settings)：同樣聚焦 前端開發，可接著比較不同情境的做法。
- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 JavaScript 存取](/post/browser-embed-flash-settings)：同樣聚焦 前端開發，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。這次整理補上 GEO Answer Blocks、WebCodecs / WebGPU / WebAssembly 分工、串流管線檢查表、站內延伸閱讀、活動圖片與 FAQ。
`;export{e as default};