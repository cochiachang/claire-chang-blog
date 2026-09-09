var e=`---
title: Starling簡報分享：基於Stage3D的GPU加速2D渲染框架入門
description: 我把當年分享的Starling簡報整理成文章，說明Starling如何基於Stage3D用GPU加速Flash效能、3D坐標轉換與透視投影原理，以及VertexShader與FragmentShader的渲染流程
date: 2014-03-13
category: 前端開發
tags: [Starling, Stage3D, ActionScript, GPU, 遊戲開發]
readingTime: 4 分鐘
image: /images/tech/hero_starling-stage3d-presentation.webp
imageAlt: GPU 顯示卡與遊戲畫面，象徵 Starling 基於 Stage3D 的 GPU 加速渲染
---


# Starling簡報分享：基於Stage3D的GPU加速2D渲染框架入門

這篇整理我當年分享的 Starling 簡報重點，解決「Starling 是什麼、它憑什麼讓 Flash 效能提升上千倍」的問題。內容涵蓋 Starling 與 Stage3D 的關係、3D 坐標轉換與透視投影、VertexShader／FragmentShader 的渲染流程，以及過去主要 3D 技術的比較。

## Starling是什麼，有哪些特色？

我當時整理的 Starling 簡介重點如下：

1. 基於 Stage3D 技術來實作。
2. 在 Flash Player 11 之後的版本才能支援此技術。
3. 使用 GPU 做圖形運算，讓 Flash 的效能能達到之前的 1000 倍（官方說法）。
4. 易學：使用跟 Flash native API 類似的類別、方法、架構，讓原本熟悉 Flash 的開發者可以很快上手。
5. 可發布到多種平台，包括 iOS、Android 及各種瀏覽器。

![Starling 簡介重點整理](/images/articles/starling-stage3d-presentation-1.webp)

## 3D畫面運作的坐標系統是怎麼轉換的？

Flash 原有的坐標系統分為 Global Point 和 Local Point，開發者習慣在這兩層之間換算位置。進入 3D 世界後，坐標系統變成「世界坐標到相機坐標的轉換」——場景中每個物件先有自己的世界坐標，再經過相機視角轉換成畫面上的位置。

![世界坐標到相機坐標的轉換](/images/articles/starling-stage3d-presentation-2.webp)

## 3D透視變換有哪兩種方法？

3D 投影到 2D 畫面主要有兩種方式：

1. **正交投影（Orthographic）**：物體不論遠近都以相同比例呈現，常用於工程製圖與等角視角。
2. **透視投影（Perspective）**：越遠的物體越小，模擬真實人眼所見。

![正交投影示意](/images/articles/starling-stage3d-presentation-3.webp)

![透視投影示意](/images/articles/starling-stage3d-presentation-4.webp)

兩者的差異可以直接從比較圖看出：

![正交投影與透視投影比較](/images/articles/starling-stage3d-presentation-5.webp)

## Stage3D的渲染過程是什麼？

Stage3D 的渲染流程由兩種著色器分工：

- **VertexShader**：負責 3D 流程的前半段操作，對頂點進行一系列的矩陣變換。
- **FragmentShader**：對變換後的頂點（以及流程中的光柵化部分）進行渲染。

![Stage3D 渲染流程](/images/articles/starling-stage3d-presentation-6.webp)

## 過去主要的3D技術有哪些？

在 Stage3D 出現之前，3D 技術分成兩大陣營：

1. **使用 GPU 的 3D 引擎（硬體加速，hardware acceleration）**
   - DirectX
   - OpenGL
2. **其他 Flash 3D 引擎（軟體模式，software mode）**
   - Papervision3D
   - Away3D
   - Alternativa3D

軟體模式全靠 CPU 運算，效能自然比不上直接調度 GPU 的硬體加速；Stage3D 的意義就在於讓 Flash 世界也接上 GPU。

## Starling的渲染方式是怎麼運作的？

Starling 把顯示物件組織成樹狀結構，渲染時整棵樹的頂點批次送進 Stage3D，用 GPU 一次畫出來，這是它能同時渲染大量物件仍維持流暢的關鍵。

![Starling 的渲染方式](/images/articles/starling-stage3d-presentation-7.webp)

完整的細節請直接看當時的投影片：

<iframe style="border: 1px solid #CCC; border-width: 1px 1px 0; margin-bottom: 5px; max-width: 100%;" src="http://www.slideshare.net/slideshow/embed_code/32251706" height="486" width="597" allowfullscreen="" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>

## 常見問題

### Starling需要哪個版本的Flash Player？

需要 Flash Player 11 之後的版本，因為 Starling 是建立在 Stage3D 技術上，而 Stage3D 從 Flash Player 11 才開始支援。

### 為什麼Starling能讓Flash效能提升這麼多？

Starling 把圖形運算交給 GPU 而不是 CPU，官方宣稱效能可達之前的 1000 倍。它把每張圖當成兩個三角形貼材質繪製，正中 GPU 最擅長的工作。

### Starling容易上手嗎？

相當容易。Starling 的類別、方法、架構都與 Flash native API 類似，原本熟悉 Flash 的開發者幾乎可以無痛轉換，還能發布到 iOS、Android 與瀏覽器等多平台。

### 正交投影和透視投影差在哪裡？

正交投影不論遠近都以相同比例呈現物體；透視投影則讓越遠的物體越小，模擬人眼所見。前者適合工程製圖，後者適合擬真 3D 場景。

### VertexShader和FragmentShader各負責什麼？

VertexShader 負責渲染流程的前半段，對頂點做一系列矩陣變換；FragmentShader 則處理變換後的頂點與光柵化部分，決定每個像素最後的顏色。

## 參考資料

- [Starling 簡報（SlideShare）](https://www.slideshare.net/claire0318/starling)

## 延伸閱讀

- [Starling 簡報分享：Stage3D 與 GPU 加速的 Flash 3D 渲染入門](/post/starling-presentation-share)：同樣聚焦 Starling、Stage3D，可接著比較不同情境的做法。
- [Starling Framework簡介](/post/starling-framework-intro)：同樣聚焦 ActionScript、Starling，可接著比較不同情境的做法。
- [Stage3D 運作原理：Flash 如何用 GPU 完成 3D 渲染？](/post/stage3d-rendering-principles)：同樣聚焦 Stage3D、ActionScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2014-03-13，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};