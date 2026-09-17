var e=`---
title: AI技術於3D模型領域的應用：用 Meshy 從文字與圖片生成 3D 模型
description: 整理我用 Meshy 這類 3D 生成式 AI 工具把文字與圖片轉成 3D 模型的經驗，涵蓋文字轉紋理、圖片轉紋理、Text-to-3D 與 Image-to-3D 四大功能，以及線上直接輸出 fbx 檔的操作流程。
date: 2024-08-06
category: 生成式AI
tags: [Meshy, 3D模型生成, 生成式AI, Text-to-3D, AI工具]
readingTime: 3 分鐘
image: /images/tech/hero_ai-3d-model-generation.webp
imageAlt: 紫色與橙色漸層的抽象 3D 曲面渲染圖，象徵 AI 生成的 3D 模型資產
---


# AI技術於3D模型領域的應用：用 Meshy 從文字與圖片生成 3D 模型

AI 生成 3D 模型的工具越來越成熟，我這篇整理的是我實際試用 [Meshy](https://www.meshy.ai/) 的筆記：它是一個線上的 3D 生成式 AI 工具箱，可以從文字或圖片在幾分鐘內生成高品質的紋理與 3D 模型，並直接輸出 fbx 檔案，大幅加速 3D 工作流程。

## Meshy 是什麼？它能做哪些事情？

Meshy 是一個創新的 3D 模型生成平台，官網寫著它是「您的 3D 生成式 AI 工具箱，用於輕鬆從文本或圖像創建 3D 資產，從而加速您的 3D 工作流程」。網站網址：<https://www.meshy.ai/>。它提供以下幾個強大的功能：

### 文字轉紋理（Text-to-Texture）

- 透過簡單的文字描述，快速生成符合要求的紋理。
- 例如：輸入「磨損的木頭紋理」，Meshy 能夠在短時間內生成逼真的木頭紋理。

### 圖片轉紋理（Image-to-Texture）

- 將概念圖或參考圖片轉換成可套用的 3D 模型紋理。
- 這對於藝術家和設計師來說，能大幅提升工作效率。

### 文字轉 3D 模型（Text-to-3D）

- 僅需一段文字描述，就能生成完整的 3D 模型。
- 即使沒有 3D 建模經驗，也能輕鬆創造出想要的模型。

### 圖片轉 3D 模型（Image-to-3D）

- 對於把 2D 概念快速轉換成 3D 模型非常有用。
- 從單張圖片中提取 3D 資訊，生成具體的 3D 模型。

## 怎麼找到別人做好的 3D 資產？

Meshy 有社區資源頁，可以直接瀏覽其他人生成並分享的 3D 資產：[Explore Community Resources](https://docs.meshy.ai/web-app-interface#explore-community-resources)。想快速找靈感或現成模型時，先逛社區資源往往比自己從零生成更快。

## 圖片轉 3D 模型的實際操作難不難？

操作網址：<https://www.meshy.ai/>。我實際操作的心得是流程非常簡單：上傳圖片、等模型生成完成後，直接按介面最右邊的下載按鈕，就能下載 fbx 檔案，後續可以再丟進 Blender、Unity 等工具繼續加工。

| 功能 | 輸入 | 適用情境 |
|---|---|---|
| Text-to-Texture | 文字描述 | 快速生成逼真材質紋理 |
| Image-to-Texture | 概念圖／參考圖 | 把既有視覺設定套到 3D 模型上 |
| Text-to-3D | 一段文字描述 | 無建模經驗也能生成完整模型 |
| Image-to-3D | 單張圖片 | 2D 概念圖快速轉成 3D 資產 |

## 常見問題

### Meshy 是免費的嗎？

Meshy 採 freemium 模式，註冊後有免費點數可以試用生成功能，點數用完或需要更高解析度、商用授權時才需要升級付費方案。實際額度以官網當下公告為準。

### 用 Meshy 生成 fbx 檔之後可以怎麼用？

下載的 fbx 檔可以直接匯入 Blender、Unity、Unreal Engine 等主流 3D 軟體或遊戲引擎，再做後續的修模、綁定或場景整合，適合快速產出原型資產。

### 沒有 3D 建模經驗也能用嗎？

可以。Meshy 的 Text-to-3D 只要輸入一段文字描述就能生成完整模型，Image-to-3D 也只需要一張圖片，整個流程不需要任何建模技能。

### 文字轉紋理實際效果如何？

以我輸入「磨損的木頭紋理」為例，Meshy 能在短時間內生成逼真的木頭紋理，對需要快速迭代材質的工作流程來說效率提升明顯。

## 參考資料

- [Meshy 官網](https://www.meshy.ai/)
- [Meshy 文件：Web App Interface](https://docs.meshy.ai/web-app-interface#explore-community-resources)
- [Meshy Image-to-3D 工作區](https://www.meshy.ai/)

## 延伸閱讀

- [AI技術於3D模型領域的應用：用 Meshy 把圖片轉成 3D 模型 FBX 檔](/post/meshy-ai-image-to-3d-model)：同樣聚焦 Meshy、生成式AI，可接著比較不同情境的做法。
- [AIGC 文字與圖片生成：ChatGPT、Bing、Bard、Claude 工具入門觀察](/post/aigc-text-image-generation)：同樣聚焦 生成式AI，可接著比較不同情境的做法。
- [SF3D：Stable Fast 3D Mesh 生成工具介紹與安裝教學](/post/sf3d-stable-fast-3d-mesh)：同樣聚焦 生成式AI，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-08-06，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};