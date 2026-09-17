var e=`---
title: PixiJS 遊戲效能評估工具：FPSMeter、stats.js 與 Chrome DevTools
description: 說明如何用 FPS、FPSMeter、stats.js 與 Chrome DevTools Performance 分析 PixiJS 遊戲效能瓶頸。
date: 2018-11-13
category: 前端開發
tags: [PixiJS, Web Game, Performance]
readingTime: 7 分鐘
image: /images/tech/hero_pixi-performance-tools.webp
imageAlt: Web 遊戲效能監測與 FPS 分析示意圖
---
# PixiJS 遊戲效能評估工具：FPSMeter、stats.js 與 Chrome DevTools

PixiJS 遊戲效能評估應先看 FPS 是否穩定，再用 Chrome DevTools 找出 script、rendering 或 painting 的瓶頸。FPSMeter 與 stats.js 適合即時監看，Chrome DevTools Performance 適合定位真正耗時的函式。

## 遊戲效能為什麼常用 FPS 評估？

FPS 是每秒顯示影格數，能直接反映玩家看到的畫面流暢度。多數螢幕以 60Hz 更新，因此 Web 遊戲常把穩定接近 60 FPS 視為基本目標。

PixiJS ticker 預設以約 60 FPS 運作。若調整 \`ticker.speed\`，影響的是 ticker 的 deltaTime 尺度，不等於硬體螢幕真的變成 120Hz。

\`\`\`js
// Scales ticker.deltaTime to what would be
// the equivalent of approximately 120 FPS
ticker.speed = 2;
\`\`\`

資訊增益：FPS 掉落只是症狀，不是原因。若只看平均 FPS，可能漏掉某一瞬間的長任務；遊戲體感通常被卡頓尖峰影響，而不是被平均值影響。

## 如何用 FPSMeter 顯示目前 FPS？

FPSMeter 適合快速在頁面上放一個 FPS 顯示器。若遊戲有自訂 render loop，可在每次 render 時呼叫 \`meter.tick()\`。

基本用法：

\`\`\`js
const meter = new FPSMeter(anchor, options);

function render() {
  // rendering happens here
  meter.tick();
}
\`\`\`

若要量測每次 render 花費時間，可用：

\`\`\`js
function render() {
  meter.tickStart();
  // rendering happens here
  meter.tick();
}
\`\`\`

FPSMeter 的優點是輕量、容易加入既有遊戲。缺點是資訊較少，通常只能當作「有沒有卡」的初步指標。

## 如何用 stats.js 監看 FPS、MS 與記憶體？

stats.js 可以顯示 FPS、每幀毫秒數與記憶體資訊，比單純 FPS 更適合開發階段監看。使用者也可以點擊 panel 切換不同指標。

基本範例：

\`\`\`js
const stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();

  // monitored code goes here

  stats.end();
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
\`\`\`

建議把 stats.js 只放在開發或 debug 模式。正式環境若需要監控，應改用自家 telemetry 或效能事件上報。

## 如何用 Chrome DevTools 找效能瓶頸？

Chrome DevTools Performance 可以錄製時間軸，讓開發者看到 FPS、CPU、scripting、rendering、painting 與每個 frame 的工作。當 FPS 掉落時，DevTools 能協助找出是哪段函式造成長任務。

操作流程：

1. 開啟 Chrome DevTools。
2. 切到 Performance。
3. 按下 Record。
4. 操作遊戲中會卡頓的流程。
5. 停止錄製並查看紅色 long task 或掉幀區段。
6. 點選可疑任務，檢查 Summary、Bottom-Up 與 Call Tree。

原文案例裡，重新 loading 時 FPS 最低、CPU 最高。進一步點進任務後，才發現真正耗時的是 \`GameScene.draw\` 繪製整個遊戲場景。

## PixiJS 效能問題應該怎麼排查？

PixiJS 效能排查應從「是否每幀做太多事」開始。常見瓶頸包含重複建立物件、過多 display object、頻繁重繪文字、濾鏡濫用與大型材質載入。

排查表：

| 現象 | 可能原因 | 檢查工具 |
| --- | --- | --- |
| FPS 穩定偏低 | 每幀運算過重 | stats.js、DevTools |
| 偶發卡頓 | 資源載入或 GC | DevTools Performance |
| 記憶體上升 | 物件未釋放 | Memory panel |
| 點擊後卡住 | event handler 過重 | Call Tree |
| 場景切換慢 | texture 或 display object 太多 | Performance timeline |

資訊增益：Chrome DevTools 顯示的任務名稱不一定是最終耗時函式，常會顯示事件鏈的起點。要點進 Call Tree 或 Bottom-Up，才比較容易找到真正需要優化的函式。

## 常見問題

### PixiJS 遊戲一定要達到 60 FPS 嗎？

多數互動遊戲應以接近 60 FPS 為目標。若是靜態或低互動工具，穩定與操作回饋通常比追求滿幀更重要。

### FPSMeter 和 stats.js 要選哪一個？

只想快速顯示 FPS 可用 FPSMeter。若想同時看每幀毫秒數與記憶體，stats.js 比較適合。

### Chrome DevTools Performance 看不懂怎麼辦？

先找紅色 long task 與 FPS 掉落區間，再點進 Call Tree。不要急著看所有欄位，先確認哪個函式佔最多時間。

### \`ticker.speed = 2\` 可以讓遊戲變順嗎？

不一定。\`ticker.speed\` 改變 deltaTime 的尺度，不能消除每幀運算過重造成的卡頓。

### Web 遊戲效能優化第一步是什麼？

第一步是建立可重現的卡頓流程並錄製 Performance。沒有可重現流程時，優化容易只是在猜。

## 參考資料

- FPSMeter：[GitHub](https://github.com/darsain/fpsmeter)
- GitHub： [stats.js](https://github.com/mrdoob/stats.js/)
- Chrome for Developers：[Performance panel](https://developer.chrome.com/docs/devtools/performance/)
- PixiJS Docs：[Ticker](https://pixijs.download/release/docs/ticker.Ticker.html)

## 延伸閱讀

- [PixiJS devtools：用 Chrome 擴充功能除錯 Canvas 遊戲場景與屬性](/post/pixijs-devtools-chrome-extension)：同樣聚焦 PixiJS，可接著比較不同情境的做法。
- [PixiJS 介紹：2D WebGL 遊戲引擎適合做什麼？](/post/pixijs-introduction-2d-webgl-game-engine)：同樣聚焦 PixiJS，可接著比較不同情境的做法。
- [PixiJS 音樂音效設定：PixiJS Sound 與 Howler.js 怎麼選？](/post/pixijs-sound-howler-audio-setup)：同樣聚焦 PixiJS，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28。原文發布於 2018-11-13，本文保留 PixiJS 效能工具範例，並補上排查順序。

`;export{e as default};