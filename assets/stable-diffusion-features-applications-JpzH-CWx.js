var e=`---
title: "Stable Diffusion 主要功能與應用全解析：從圖像生成到科學研究"
description: "Stable Diffusion 有哪些主要功能？本文整理圖像生成、圖像修復與編輯（ADetailer）、多模態應用、動畫與遊戲開發、醫學與自然科學研究等應用場景，並附官方網站、Civitai 開源社群與 SVD 模型下載資源，幫你快速掌握這套開源文生圖模型的完整用途。"
date: 2024-08-06
category: 生成式AI
tags: [Stable Diffusion, 文生圖, 生成式AI, SDXL, 圖像生成]
readingTime: 5 分鐘
image: /images/tech/hero_stable-diffusion-features-applications.webp
imageAlt: "以文字描述生成圖像的 AI 繪圖概念示意圖"
---


# Stable Diffusion 主要功能與應用全解析：從圖像生成到科學研究

Stable Diffusion 是目前最流行的開源文生圖模型之一，能用一段文字描述生成圖像，也能修復、編輯既有圖片，甚至延伸到動畫、遊戲與科學研究。這篇文章整理 Stable Diffusion 的主要功能與實際應用場景，並附上官方網站與開源社群資源，幫你快速掌握它到底能做什麼、該去哪裡找模型。

## Stable Diffusion 的官方網站與開源社群在哪裡？

我先從兩個最重要的資源入口說起：

- **官方網站**：[https://stability.ai](https://stability.ai)。在這裡可以看到 Stability AI 這個平台目前提供的相關工具，包括圖像生成、影像生成、音樂生成、3D 模型生成、文字生成。
- **開源社群**：[https://civitai.com](https://civitai.com)。可以下載許多人自己生成的模型和相關微調模型（Checkpoint、LoRA 等），社群裡也有大量使用者分享的生成圖片可以直接參考 prompt 與參數。

## Stable Diffusion 的圖像生成功能怎麼用？

### 根據文本生成圖像

- **描述生成**：我可以輸入一段文字描述，Stable Diffusion 模型會根據這段描述生成對應的圖像。例如輸入「日落下的山脈」，模型就會生成一幅描繪日落下山脈的圖像。

### 創意生成

- **藝術創作**：藝術家可以使用 Stable Diffusion 生成具有特定風格或主題的圖像，從而激發創意和靈感。
- **概念設計**：設計師可以快速生成概念草圖，用於產品設計或廣告創意。

### 圖像生成使用的模型：SD1.x、SD2.x、SDXL

各版本差異：

| 模型版本 | 特點 |
| --- | --- |
| SD1.x | 最早的開源版本，社群資源最豐富 |
| SD2.x | 改進訓練方式與解析度 |
| SDXL | 目前系列中較新的模型之一 |

SDXL 是目前 Stable Diffusion 系列中最新的模型之一。它在 SD2.x 的基礎上進一步提升了圖像的品質和細節，尤其是在處理複雜的場景和人物時表現更加出色。SDXL 還能夠生成更加多樣化的圖像風格，為用戶提供了更多的創作可能性。

更多資訊可參考：[Stable Diffusion XL 說明及 SDXL 1.0 安裝教學](https://chrislee0728.medium.com/stable-diffusion-xl-%E8%AA%AA%E6%98%8E%E5%8F%8A-sdxl1-0-%E5%AE%89%E8%A3%9D%E6%95%99%E5%AD%B8-b2f7648d49ff)。

## Stable Diffusion 能做圖像修改和增強嗎？

### 圖像修復

- **缺損修復**：模型可以自動填補和修復圖像中缺失或損壞的部分，恢復圖像的完整性。
- **品質增強**：提高低解析度圖像的質量，使其更加清晰和細緻。

### 圖像編輯

- **局部修改**：我可以指定圖像的某個區域進行修改，例如改變圖像中的顏色、形狀或添加新的元素。
- **風格轉換**：將圖像轉換為不同的藝術風格，如將照片變為素描或油畫效果。

### 技術介紹：ADetailer 外掛

要使用 Stable Diffusion 來做到圖像修復或圖像編輯，需要安裝相關的 ADetailer 外掛，以下為一個範例：[CSDN 的 ADetailer 教學](https://blog.csdn.net/2401_84250575/article/details/138863838)。

以 Web UI 為例，安裝 ADetailer 的擴展套件之後，就可以讀取相關的模型來修復圖片（例如自動偵測臉部並重建細節）。

## 什麼是多模態應用？Stable Diffusion 也能做圖文匹配

### 圖像-文本匹配

- **圖像標註**：根據圖像生成相應的文本描述，適用於自動標註和圖像檢索。
- **文本生成圖像**：根據文本描述生成圖像，用於多模態數據集的構建和應用。

### 文本-圖像交互

- **文本驅動的圖像編輯**：我可以透過文本指令對圖像進行特定修改，例如「將天空變成藍色」或「在圖像中添加一棵樹」。

## Stable Diffusion 有哪些創意應用？動畫與遊戲開發

### 動畫生成

- **動畫創作**：透過生成連續的圖像幀來創建動畫效果，適用於動畫製作和電影特效。
- 介紹網頁：[Stable Video Diffusion 開源影片模型](https://stability.ai/news/stable-video-diffusion-open-ai-video-model)
- GitHub 位置：[Stability-AI/generative-models](https://github.com/Stability-AI/generative-models)
- 一秒 25 幀模型下載：[svd_xt.safetensors](https://huggingface.co/stabilityai/stable-video-diffusion-img2vid-xt/blob/main/svd_xt.safetensors)
  - 一秒 14 幀模型下載：[svd.safetensors](https://huggingface.co/stabilityai/stable-video-diffusion-img2vid/blob/main/svd.safetensors)

<iframe width="560" height="315" src="https://www.youtube.com/embed/G7mihAy691g" title="Stable Video Diffusion 示範影片" frameborder="0" allowfullscreen></iframe>

### 遊戲開發

- **遊戲場景生成**：根據描述生成遊戲場景，幫助遊戲開發者快速創建豐富的遊戲內容。
- Diffree: Text-Guided Shape Free Object Inpainting with Diffusion Model：[https://opengvlab.github.io/Diffree/](https://opengvlab.github.io/Diffree/)
- SceneTex: High-Quality Texture Synthesis for Indoor Scenes via Diffusion Priors：[https://daveredrum.github.io/SceneTex/](https://daveredrum.github.io/SceneTex/)

## Stable Diffusion 在科學研究上能幫上什麼忙？

### 醫學圖像分析

- **醫學影像生成**：根據描述生成醫學影像，輔助醫學研究和診斷。
- **圖像合成**：生成合成的醫學圖像，用於訓練和測試醫學影像分析模型。

### 自然科學模擬

- **氣象模擬**：生成氣象圖像，用於天氣預測和氣候研究。
- **地理模擬**：根據描述生成地理景觀圖像，幫助地理研究和模擬。

## 常見問題

### Stable Diffusion 是免費的嗎？

Stable Diffusion 的模型權重以開源方式釋出，可以自行下載並在本機或雲端執行，官方網站 stability.ai 則提供付費的線上工具。開源社群 Civitai 上還有大量免費的微調模型可以下載。

### SDXL 和 SD1.5 有什麼差別？

SDXL 在 SD2.x 的基礎上提升了圖像品質和細節，處理複雜場景與人物時表現更出色，也能生成更多樣化的風格。SD1.5 模型較小、硬體需求較低，社群資源也最豐富。

### 如何修復或局部編輯生成的圖像？

在 Stable Diffusion Web UI 安裝 ADetailer 擴展套件，就可以載入對應的修復模型，自動填補缺損、增強品質或對指定區域做局部修改。也可以用內建的 inpaint 功能指定區域重繪。

### Stable Diffusion 可以生成影片或動畫嗎？

可以。Stability AI 釋出了 Stable Video Diffusion（SVD），提供一秒 14 幀與 25 幀的模型，可從單張圖像生成連續影片幀，模型權重放在 Hugging Face 上可直接下載。

### 哪裡可以下載 Stable Diffusion 的微調模型？

Civitai（https://civitai.com）是最大的開源模型社群，收錄許多使用者自行訓練的 Checkpoint 與 LoRA 微調模型，搭配官方 stability.ai 與 Hugging Face 的原始模型使用。

## 參考資料

- [Stability AI 官方網站](https://stability.ai/)
- [Stable Diffusion GitHub（CompVis）](https://github.com/CompVis/stable-diffusion)
- [Hugging Face：Stable Diffusion 模型頁](https://huggingface.co/stabilityai)

## 延伸閱讀

- [Stable Diffusion 主要功能與應用全解析：從文生圖到多模態與科學研究](/post/stable-diffusion-features-applications)：同樣聚焦 Stable Diffusion、生成式AI，可接著比較不同情境的做法。
- [Stable Diffusion 常用操作介面比較：Easy Diffusion、ComfyUI 與 Stable Diffusion web UI](/post/stable-diffusion-interfaces-easydiffusion-comfyui-webui)：同樣聚焦 Stable Diffusion、生成式AI，可接著比較不同情境的做法。
- [Stable Diffusion 操作介面怎麼選？Easy Diffusion、ComfyUI、web UI 三套工具比較](/post/stable-diffusion-ui-comparison)：同樣聚焦 Stable Diffusion、生成式AI，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2024-08-06，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};