var e=`---
title: Starling 簡報分享：Stage3D 與 GPU 加速的 Flash 3D 渲染入門
description: 分享我的 Starling 簡報重點：Starling 基於 Stage3D 技術，用 GPU 做圖形運算讓 Flash 效能大幅提升，並整理 3D 坐標系統、正交與透視投影、VertexShader 與 FragmentShader 的渲染流程，以及過去主要的 3D 技術比較。
date: 2014-03-13
category: 前端開發
tags: [Starling, Stage3D, Flash, GPU, 3D渲染]
readingTime: 3 分鐘
image: /images/tech/hero_starling-presentation-share.webp
imageAlt: 呈現 3D 圖形運算與 GPU 渲染概念的抽象立方體影像
---


# Starling 簡報分享：Stage3D 與 GPU 加速的 Flash 3D 渲染入門

這篇整理我當時分享的 Starling 簡報重點，涵蓋 Starling 的核心特性、3D 畫面的運作原理、投影方法與 Stage3D 的渲染過程。完整的內容可以直接看文末嵌入的 SlideShare 投影片。

## 為什麼 Starling 能讓 Flash 效能大幅提升？

我在簡報中先把 Starling 的幾個重點特性整理如下：

- 基於 Stage3D 技術來實作。
- 在 Flash Player 11 之後的版本才能支援此技術。
- 使用 GPU 做圖形的運算，讓 Flash 的效能能夠到之前的 1000 倍（官方說法）！
- 易學，使用跟 Flash native API 類似的類別、方法、架構等，讓原本熟悉 Flash 的開發者可以很快地上手。
- 可發布到多種平台（包括 iOS、Android 及各種瀏覽器）。

![Starling 簡報中的特性示意圖](/images/articles/starling-presentation-share-1.webp)

完整的簡報在這裡：

<iframe style="border: 1px solid #CCC; border-width: 1px 1px 0; margin-bottom: 5px; max-width: 100%;" src="https://www.slideshare.net/slideshow/embed_code/32251706" height="486" width="597" allowfullscreen="" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

[Starling](https://www.slideshare.net/claire0318/starling) — 我的 SlideShare 頁面：<https://www.slideshare.net/claire0318>

## 3D 畫面的運作原理是什麼？

要理解 Starling 為什麼快，得先從 3D 畫面怎麼被畫出來說起：

- Flash 原有的坐標系統：Global Point 和 Local Point。
- 3D 世界的坐標系統：世界坐標到相機坐標的轉換。

![3D 世界坐標到相機坐標的轉換示意圖](/images/articles/starling-presentation-share-2.webp)

## 3D 透視變換有哪些方法？

簡報中我比較了兩種常見的投影方式：

1. **正交投影**

![正交投影示意圖](/images/articles/starling-presentation-share-3.webp)

2. **透視投影**

![透視投影示意圖](/images/articles/starling-presentation-share-4.webp)

3. **比較圖**

![正交投影與透視投影比較圖](/images/articles/starling-presentation-share-5.webp)

## Stage3D 的渲染過程是怎麼進行的？

Stage3D 的渲染核心在兩種 Shader：

- **VertexShader**：主要作用就是 3D 流程中的前半段操作，對頂點進行一系列的矩陣變換。
- **FragmentShader**：對這些變換後的頂點（及流程中的光柵化部分）進行渲染。

![Stage3D 的渲染流程圖](/images/articles/starling-presentation-share-6.webp)

## 過去主要的 3D 技術有哪些？

在 Stage3D 出現之前，3D 技術大致分成兩類：

| 類型 | 模式 | 代表技術 |
| --- | --- | --- |
| 使用 GPU 的 3D 引擎 | 硬件加速（hardware acceleration） | DirectX、OpenGL |
| 其他 Flash 3D 引擎 | 軟件模式（software mode） | Papervision3D、Away3D、Alternativa3D |

## Starling 的渲染方式有什麼不同？

Starling 藉由 Stage3D 直接使用 GPU 加速，跳過了過去軟件模式的效能瓶頸：

![Starling 的渲染方式示意圖](/images/articles/starling-presentation-share-7.webp)

更細節的內容我就不在這邊展開，剩下的請自行看投影片。

## 常見問題

### Starling 是什麼？

Starling 是一個基於 Flash Player 11 Stage3D 技術的 2D 遊戲框架。它透過 GPU 做圖形運算，官方宣稱效能可達傳統 Flash 顯示列表的 1000 倍，而且 API 設計貼近 Flash native API，上手門檻低。

### 為什麼 Starling 需要 Flash Player 11 之後的版本？

因為 Starling 建立在 Stage3D 之上，而 Stage3D 是 Flash Player 11 才導入的 GPU 加速技術。舊版播放器沒有這個底層，Starling 無法運作。

### 正交投影和透視投影有什麼差別？

正交投影不考慮距離造成的縮放，物體不論遠近大小都一致，適合工程製圖類的畫面。透視投影則模擬人眼，近大遠小，是大多數 3D 場景採用的方式。

### VertexShader 和 FragmentShader 各負責什麼？

VertexShader 負責渲染流程的前半段，對頂點做一系列矩陣變換（例如世界坐標到相機坐標的轉換）。FragmentShader 則在光柵化之後，對這些變換完成的頂點片段進行著色渲染。

### Stage3D 出現之前的 Flash 3D 引擎是怎麼運作的？

Papervision3D、Away3D、Alternativa3D 等引擎採用軟件模式（software mode），由 CPU 計算 3D 圖形。相較之下，使用 GPU 硬件加速的引擎（如 DirectX、OpenGL，以及後來的 Stage3D）效能高出一大截。

## 參考資料

- [Starling 簡報（SlideShare）](https://www.slideshare.net/claire0318/starling)
- [我的 SlideShare 頁面](https://www.slideshare.net/claire0318)

## 延伸閱讀

- [Starling簡報分享：基於Stage3D的GPU加速2D渲染框架入門](/post/starling-stage3d-presentation)：同樣聚焦 Starling、Stage3D，可接著比較不同情境的做法。
- [Stage3D 運作原理：Flash 如何用 GPU 完成 3D 渲染？](/post/stage3d-rendering-principles)：同樣聚焦 Stage3D、Flash，可接著比較不同情境的做法。
- [Starling Framework簡介](/post/starling-framework-intro)：同樣聚焦 Starling、Stage3D，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2014-03-13，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};