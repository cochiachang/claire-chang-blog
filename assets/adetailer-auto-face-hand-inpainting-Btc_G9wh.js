var e=`---
title: "ADetailer 自動人臉檢測與高品質修復完整教學"
description: "ADetailer 是 Stable Diffusion 的自動人臉檢測與修復插件，透過 YOLO 模型定位臉部與手部，再以局部重繪解決 AI 繪圖常見的臉部、手部畸形。本文涵蓋安裝步驟、模型列表、提示詞範例與表情修改技巧。"
date: 2024-08-12
category: 生成式AI
tags: [ADetailer, Stable Diffusion, AI圖像修復, YOLO模型, 局部重繪]
readingTime: 6 分鐘
image: /images/tech/hero_adetailer-auto-face-hand-inpainting.webp
imageAlt: 兩張人臉眼部特寫對比，象徵 AI 圖像的人臉細節修復
---


# ADetailer 自動人臉檢測與高品質修復完整教學

在 AI 繪圖領域中，Stable Diffusion 已成為一個強大的工具，但它在生成人臉和手部細節時常常會出現畸形問題。為了解決這個困擾，我使用 ADetailer 這個 Stable Diffusion 插件來做自動修復——它專門針對 AI 圖像修復，特別是在人臉優化和手部修正方面表現出色。這篇文章整理它的核心功能、安裝步驟、模型選擇與實用提示詞範例。

## ADetailer 是什麼？它能解決什麼問題？

ADetailer 是一款功能強大的 AI 圖像修復工具，它的主要特點包括：

1. **自動人臉檢測**：利用先進的 YOLO 模型，ADetailer 能夠精確定位圖像中的人臉。
2. **局部重繪**：透過生成精確的遮罩，ADetailer 可以只對需要修復的區域進行重繪，保留原圖其他部分的完整性。
3. **高解析度修復**：對於低解析度圖像，ADetailer 能夠進行優化，提升圖像質量。
4. **多模型支援**：除了 YOLO 模型，ADetailer 還支援 MediaPipe 模型，提供更多選擇。
5. **一鍵修復**：簡化了複雜的修復流程，只需點擊幾下就能完成高質量的圖像修復。

## 為什麼選擇 ADetailer 而不是手動修復？

相比手動修復，ADetailer 在效率和效果上都有顯著優勢。它不僅能夠快速處理全身圖像生成中的細節問題，還可以輕鬆實現表情調整和年齡變化等高級效果。

它的運作流程是：

- 使用檢測模型自動識別人臉和手部。
- 對面部和手部的識別部分使用 Stable Diffusion 進行裁剪和校正。
- 將校正後的面部和手部圖像小心地重新置放到其原始位置。

ADetailer 不僅可以用於修復扭曲的臉部，還有一些其他用途：

- 改變面部表情
- 更改一個人的年齡
- 改變外觀以類似於不同的種族或氛圍
- 僅將 LoRA 增強功能應用於面部

Stable Diffusion 專注於面部和手部的再生，從而改善了結果。在再生過程中，裁剪區域具有更高的解析度，可以詳細呈現眼睛和鼻子等各個特徵，最終產生精美的面部描繪。

ADetailer 在三個關鍵方面超越了其他技術，使其成為面部矯正的首選：

- **便利性**：啟動「Enable ADetailer」選項即可啟動自動面部矯正，確保使用者友好且無憂的體驗。
- **記憶體消耗和生成時間優化**：與涉及放大原始圖像的許多其他方法不同——那些方法會導致更大的檔案大小和更長的處理時間——ADetailer 只關注面部圖像，可以在不影響整體圖像解析度的情況下進行有效校正。
- **將 LoRA 應用於面部的靈活性**：ADetailer 允許在矯正過程中進行微小調整，提供更大的靈活性和便利性。

## 如何安裝 ADetailer？

GitHub 專案位置：<https://github.com/Bing-su/adetailer>

以下是使用 Stable Diffusion WebUI 安裝 ADetailer 的步驟：

1. 切換到「擴展插件 / Extensions」頁面，選擇「從網址安裝 / Install from URL」。
2. 輸入：<https://github.com/Bing-su/adetailer.git>，按下安裝。
3. 按下「Apply and restart UI」按鈕。

此時進入「擴展插件 > 已安裝」，應該要可以看到 ADetailer。

![已安裝擴充插件列表中出現 ADetailer](/images/articles/adetailer-auto-face-hand-inpainting-1.webp)

接著確認首頁是否有出現 ADetailer 的設定欄位。

![WebUI 首頁出現 ADetailer 設定區塊](/images/articles/adetailer-auto-face-hand-inpainting-2.webp)

## ADetailer 有哪些檢測模型？

ADetailer 提供用於檢測人臉、手和身體的模型。可根據想要生成的圖像，或想要校正的特定部分（例如面部、手部、身體）選擇適當的模型。

| Model | Target 目標 |
| --- | --- |
| face_yolov8n.pt | 臉部（插圖/真實） |
| face_yolov8s.pt | 臉部（插圖/真實） |
| hand_yolov8n.pt | 手（插圖/真實） |
| person_yolov8n-seg.pt | 人物（插圖/真實） |
| person_yolov8n-seg.pt | 全身（插圖/真實） |
| person_yolov8s-seg.pt | 全身（插圖/真實） |
| mediapipe_face_full | 人臉（真實） |
| mediapipe_face_short | 人臉（真實） |
| mediapipe_face_mesh | 人臉（真實） |

## 如何在 ADetailer 選單中輸入提示詞？

以下為一個範例。

Prompt：

\`\`\`text
(8k, RAW photo, best quality, masterpiece:1.2), (realistic, photo-realistic:1.4), (extremely detailed 8k wallpaper), cheerleader outfit, 20-year-old woman, detailed face
\`\`\`

Negative Prompt：

\`\`\`text
EasyNegative, deformed face, ugly, bad face, deformed eyes
\`\`\`

下圖左邊沒有使用 ADetailer，右邊則應用了 ADetailer。可以觀察到 ADetailer 可以糾正面部的任何扭曲。

![使用 ADetailer 前後的面部修復對比](/images/articles/adetailer-auto-face-hand-inpainting-3.webp)

## 如何用 ADetailer 改變表情和修復手部？

改變表情的步驟：

1. 切換到「圖像信息（PNG Info）」選項。
2. 選擇要修改的圖片。
3. 輸入提示詞。

![在 PNG Info 頁面讀取圖片資訊並輸入提示詞](/images/articles/adetailer-auto-face-hand-inpainting-4.webp)

若想檢查是否為五根手指，可使用以下設定。

提示詞關鍵字：

- \`five fingers\`

否定提示詞關鍵詞：

- \`deformed hand\`
- \`extra_fingers\`
- \`bad fingers\`
- \`missing fingers\`
- \`fewer digits, extra digit\`
- \`liquid fingers\`

![手部修復的提示詞設定與成果](/images/articles/adetailer-auto-face-hand-inpainting-5.webp)

## 常見問題

### ADetailer 是做什麼用的？

ADetailer 是 Stable Diffusion WebUI 的擴充插件，會自動用 YOLO 或 MediaPipe 模型偵測圖像中的臉部、手部或全身，再對偵測到的區域做局部重繪。它主要用來修復 AI 繪圖常見的面部和手部畸形，也能用來改變表情、年齡或只對臉部套用 LoRA。

### ADetailer 支援哪些檢測模型？

它支援 face_yolov8n/s（臉部）、hand_yolov8n（手部）、person_yolov8n/s-seg（人物與全身）等 YOLO 模型，以及 mediapipe_face_full、short、mesh 等真實照片取向的人臉模型。插圖和真實圖像都可選擇對應模型。

### ADetailer 會不會很吃顯示卡記憶體或拖慢生成速度？

不會明顯增加。與放大整張原圖的修復方式不同，ADetailer 只對偵測到的小區域（如臉部）做高解析度重繪，完成後再貼回原圖，因此檔案大小與處理時間的增幅有限。

### 如何安裝 ADetailer？

在 Stable Diffusion WebUI 的 Extensions 頁面選擇「Install from URL」，輸入 \`https://github.com/Bing-su/adetailer.git 後安裝，再按 Apply and restart UI 重啟即可。安裝完成後首頁會出現 ADetailer 設定區塊。

### 如何用 ADetailer 修復畸形的手部？

在 ADetailer 選擇 \`hand_yolov8n.pt\` 模型，提示詞加入 \`five fingers\`，並在否定提示詞加入 \`deformed hand\`、\`extra_fingers\`、\`bad fingers\`、\`missing fingers\` 等關鍵詞，讓重繪時修正手指數量與形狀。

## 參考資料

- [ADetailer GitHub（Bing-su/adetailer）](https://github.com/Bing-su/adetailer)

## 延伸閱讀

- [ADetailer: 自動人臉檢測和高品質修復](/post/adetailer-auto-face-hand-inpainting)：同樣聚焦 ADetailer、Stable Diffusion，可接著比較不同情境的做法。
- [Stable Diffusion 主要功能與應用全解析：從圖像生成到科學研究](/post/stable-diffusion-features-applications)：同樣聚焦 Stable Diffusion，可接著比較不同情境的做法。
- [Stable Diffusion 主要功能與應用全解析：從文生圖到多模態與科學研究](/post/stable-diffusion-features-applications)：同樣聚焦 Stable Diffusion，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-08-12，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};