var e=`---
title: Pixi.js 網頁遊戲開發實戰：從介紹到連連看遊戲的完整開發流程
description: 分享我在 Women Who Code Taipei 的 Pixi.js 網頁遊戲開發實戰分享，涵蓋 PixiJS 核心概念、場景與素材載入、按鈕互動、音效設定到連連看遊戲完整實作的開發流程。
date: 2022-05-22
category: 前端開發
tags: [PixiJS, WebGL, 網頁遊戲, 前端開發, 連連看]
readingTime: 6 分鐘
image: /images/tech/hero_pixijs-web-game-development-practice.webp
imageAlt: 在社群活動中分享 Pixi.js 網頁遊戲開發實戰的現場照片
---


# Pixi.js 網頁遊戲開發實戰：從介紹到連連看遊戲的完整開發流程

這篇文章整理我在 Women Who Code Taipei 分享的「Pixi.js 網頁遊戲開發實戰」主題，說明如何用 PixiJS 這套 2D WebGL 渲染引擎開發網頁遊戲。內容涵蓋 PixiJS 核心概念、實作連連看遊戲會用到的場景設定、素材載入、按鈕互動、音效與連線效果等完整流程，並附上當天的活動資訊與簡報連結。

## 這場 Pixi.js 網頁遊戲開發實戰分享在講什麼？

這場分享以「用 PixiJS 從零做出一個網頁連連看遊戲」為主軸，帶大家走過一個完整的 2D 網頁遊戲開發流程。PixiJS 是 JavaScript 的 2D WebGL 渲染引擎，負責把 Sprite、Texture、動畫與濾鏡高效能地渲染到 Canvas 上，而遊戲邏輯、狀態管理、音效等配套則由我們自行組合。

分享中拆解的實作步驟大致如下：

1. **PIXI 場景設定**：建立 Application、Container，規劃遊戲畫面結構。
2. **載入素材**：使用 Assets/Loader 載入圖片與 spritesheet，並控制 loading 畫面。
3. **盤面與公仔實作**：產生連連看盤面、逐格動畫（frame animation）呈現公仔。
4. **互動功能**：按鈕製作、按鈕動態（Tween）、提示與重整、復原（Undo）按鈕。
5. **遊戲流程**：遊戲開始、結束與過關畫面。
6. **音效與連線**：搭配 Howler 設定音樂音效，用 Graphics 實作連線效果。
7. **進階效果**：PixiParticles 粒子特效與開發者工具除錯。

## 為什麼選 PixiJS 開發網頁遊戲？

PixiJS 的定位是 2D renderer 而非完整遊戲框架，優勢在於使用 WebGL 加速大量 2D 物件渲染。當遊戲畫面上有大量 Sprite、粒子與逐格動畫時，直接操作 DOM 或 SVG 成本很高，PixiJS 能用顯示清單（display list）的思維高效處理。

對我來說，PixiJS 的 API 與過去熟悉的 Flash/Starling 概念接近：\`Sprite\`、\`addChild()\`、\`gotoAndPlay()\` 等，上手門檻低，又不需要背負完整框架的限制，適合想自行掌控遊戲架構的專案。

## 活動連結

- Meetup：[Pixi.js 網頁遊戲開發實戰（Women Who Code Taipei）](https://www.meetup.com/women-who-code-taipei/events/285631942)

## 活動截圖

![Pixi.js 網頁遊戲開發實戰分享會現場照片](/images/articles/pixijs-web-game-development-practice-1.webp)

## 活動簡報

完整簡報已發佈在 SlideShare：[Pixi.js 網頁遊戲開發實戰 from Claire Chang](https://www.slideshare.net/claire0318/pixijs-254014166)

## 常見問題

### PixiJS 可以直接做一個完整遊戲嗎？

PixiJS 提供渲染與顯示物件能力，遊戲邏輯、狀態、物理與音效需要自行組合或搭配其他套件。以連連看為例，盤面演算法、按鈕互動與音效都是用 PixiJS 加上自寫邏輯與 Howler 完成。

### 沒有遊戲開發經驗也能學 PixiJS 嗎？

可以。PixiJS 本質上是 JavaScript 的 2D 渲染函式庫，只要有網頁開發基礎就能上手。建議從 Application、Container、Sprite、Loader 這幾個核心概念開始，邊改範例邊看結果。

### 連連看遊戲的實作難點在哪裡？

主要難點不在渲染而在遊戲邏輯：盤面生成要保證有解、消除判定要走連線演算法、復原功能需要記錄歷史狀態。渲染部分用 PixiJS 的 Graphics 畫連線、用逐格動畫呈現公仔即可。

### 這場分享有錄影或簡報可以看嗎？

簡報已公開在 SlideShare，可以在上文「活動簡報」段落找到連結；活動細節則可參考 Meetup 活動頁。

## 參考資料

- [Pixi.js 網頁遊戲開發實戰 — Women Who Code Taipei Meetup](https://www.meetup.com/women-who-code-taipei/events/285631942)
- [Pixi.js 網頁遊戲開發實戰簡報 — SlideShare](https://www.slideshare.net/claire0318/pixijs-254014166)
- [PixiJS 官方網站](https://pixijs.com/)

## 延伸閱讀

- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 PixiJS、連連看，可接著比較不同情境的做法。
- [PixiJS 連連看遊戲開始、結束與過關畫面教學](/post/pixijs-link-game-start-end-clear-screens)：同樣聚焦 PixiJS、連連看，可接著比較不同情境的做法。
- [PixiJS 介紹：2D WebGL 遊戲引擎適合做什麼？](/post/pixijs-introduction-2d-webgl-game-engine)：同樣聚焦 PixiJS、WebGL，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-05-22，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};