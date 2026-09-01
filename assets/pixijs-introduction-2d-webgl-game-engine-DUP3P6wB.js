var e=`---
title: PixiJS 介紹：2D WebGL 遊戲引擎適合做什麼？
description: 說明 PixiJS 的定位、與 Phaser、Three.js 的差異，以及適合用 PixiJS 開發 2D 網頁遊戲的情境。
date: 2018-10-25
category: 前端開發
tags: [PixiJS, WebGL, Phaser, Three.js]
readingTime: 7 分鐘
image: /images/tech/hero_pixijs-introduction-2d-webgl-game-engine.webp
imageAlt: 使用 WebGL 製作 2D 網頁遊戲的開發畫面
---


# PixiJS 介紹：2D WebGL 遊戲引擎適合做什麼？

PixiJS 是 JavaScript 2D WebGL 渲染引擎，適合製作高效能 2D 網頁遊戲、互動動畫與視覺化介面。PixiJS 提供渲染與顯示物件能力，但不強制專案採用特定遊戲架構。

## PixiJS 的核心定位是什麼？

PixiJS 的核心定位是 2D renderer，而不是完整遊戲框架。PixiJS 擅長把 Sprite、Texture、容器、動畫與濾鏡高效渲染到 Canvas 或 WebGL 環境。

對熟悉 Flash 或 Starling 的開發者來說，PixiJS 的概念很容易上手。\`Sprite\`、\`addChild()\`、\`removeChildren()\`、\`gotoAndStop()\`、\`gotoAndPlay()\` 等 API 名稱與顯示清單思維都相當接近。

PixiJS 的彈性也代表專案需要自行決定配套，例如狀態管理、物理引擎、場景切換、音效、素材管理與打包流程。

## PixiJS 和 SVG、Canvas 差在哪裡？

PixiJS 最大優勢是使用 WebGL 加速大量 2D 圖形渲染。SVG 適合 DOM 型向量圖與可存取內容，Canvas 適合自由繪製，而 PixiJS 更適合大量 Sprite、粒子與遊戲畫面更新。

| 技術 | 適合情境 | 注意事項 |
|---|---|---|
| SVG | 圖表、圖示、可互動向量元素 | 大量物件時 DOM 成本較高 |
| Canvas 2D | 簡單遊戲、繪圖工具、低階繪製 | 需自行管理場景 |
| PixiJS | 2D 遊戲、粒子、動畫、互動視覺 | 主要處理渲染，不包完整遊戲框架 |

若專案需要每秒更新大量圖片物件，PixiJS 通常比直接操作 DOM 或 SVG 更合適。

## PixiJS 和 Phaser 要選哪一個？

PixiJS 適合想自行組合架構的 2D 渲染專案，Phaser 適合需要完整遊戲框架的專案。Phaser 提供物理、場景、輸入、音效、素材載入與遊戲狀態等整合能力。

Phaser 額外提供的能力包括：

- Arcade 或完整物理系統。
- 遊戲世界與鏡頭。
- Tilemap 支援。
- 粒子系統。
- 聲音支援。
- 鍵盤、滑鼠、觸控與手把輸入。
- Scale Manager 與全螢幕處理。
- Tween Manager 與遊戲時鐘。
- 素材載入與遊戲狀態管理。

實務判斷：如果你只需要高效能 2D 畫面與自訂架構，選 PixiJS。若你正在做完整遊戲，而且不想自行補齊常見系統，Phaser 會更快。

## PixiJS 和 Three.js 可以一起用嗎？

PixiJS 負責 2D，Three.js 負責 3D。兩者可以在同一個產品中並存，但要注意 2D 與 3D 在同一 Canvas 或不同 Canvas 中的層級、事件與渲染順序。

Three.js 使用攝影機、材質、光影與 3D 場景管理。PixiJS 則以 2D 顯示物件為核心。若把 2D UI 疊在 3D 畫面上，常見做法是讓 PixiJS 或一般 HTML UI 作為 overlay，而不是硬把所有東西塞進同一個渲染流程。

## 學習 PixiJS 可以從哪些資源開始？

學習 PixiJS 應先理解 Application、Container、Sprite、Texture、Ticker 與 Assets 載入流程。掌握這些核心概念後，再進入互動事件、spritesheet、filter 與效能優化。

建議資源：

- PixiJS 官方文件：查 API 與版本差異。
- PixiJS Examples：快速看最小可執行範例。
- PixiJS GitHub：追蹤版本與 issue。
- Phaser 文件：如果需要完整遊戲框架，可比較架構差異。

原稿提到的學習經驗仍然成立：搭配 example 邊改邊看結果，是學 PixiJS 最快的方式。

## 常見問題

### PixiJS 是遊戲引擎嗎？

PixiJS 比較精確的定位是 2D WebGL renderer。PixiJS 可以用來做遊戲，但物理、關卡、狀態與音效通常需要自行整合或搭配其他工具。

### PixiJS 適合做手機網頁遊戲嗎？

PixiJS 適合做手機網頁 2D 遊戲，但仍需要測試裝置效能、貼圖大小、記憶體與觸控事件。低階裝置上大量粒子或高解析貼圖仍可能卡頓。

### PixiJS 和 Phaser 哪個比較適合初學者？

想理解渲染與顯示物件，PixiJS 很適合。想快速做出完整遊戲流程，Phaser 通常對初學者更省時間。

### PixiJS 可以做 3D 遊戲嗎？

PixiJS 主要是 2D 引擎，不適合當作 3D 遊戲核心。3D 場景通常使用 Three.js、Babylon.js 或其他 3D 引擎。

### Flash 開發者學 PixiJS 會容易嗎？

Flash 開發者通常能快速理解 PixiJS，因為 Sprite、Container、顯示清單與動畫控制概念相近。差異在於現代前端打包、模組與瀏覽器效能限制。

## 參考資料

- PixiJS 官方網站：<https://pixijs.com/>
- PixiJS Examples：<https://pixijs.com/8.x/examples>
- PixiJS GitHub：<https://github.com/pixijs/pixijs>
- Phaser 官方網站：<https://phaser.io/>
- Three.js 官方網站：<https://threejs.org/>
- Stack Overflow, Decide Pixi.js or Phaser：<https://stackoverflow.com/questions/38509629/decide-pixi-js-or-phaser>

## 延伸閱讀

- [Pixi.js 網頁遊戲開發實戰：從介紹到連連看遊戲的完整開發流程](/post/pixijs-web-game-development-practice)：同樣聚焦 PixiJS、WebGL，可接著比較不同情境的做法。
- [PixiJS 場景設定教學：Application、Canvas 與自動縮放](/post/pixijs-scene-setup)：同樣聚焦 PixiJS、WebGL，可接著比較不同情境的做法。
- [遊戲開發技術介紹：Graphics Library、遊戲平台與遊戲引擎怎麼選？](/post/game-dev-tech-introduction)：同樣聚焦 WebGL、PixiJS，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};