var e=`---
title: PixiJS 如何控制 loading page 與載入進度
description: 說明 PixiJS loader onProgress、onError、onComplete 與 EventEmitter 控制 loading page 的做法。
date: 2018-10-31
category: 前端開發
tags: [PixiJS, JavaScript, Loading Page, EventEmitter]
readingTime: 7 分鐘
image: /images/tech/hero_pixi-loading-page-control.webp
imageAlt: JavaScript 網頁遊戲 loading 畫面控制程式碼
---


# PixiJS 如何控制 loading page 與載入進度

PixiJS loading page 的核心做法是先在 HTML 疊一層 loading 元素，再用 loader 的 \`onProgress\` 更新百分比，最後在 \`onComplete\` 透過事件通知主程式隱藏 loading page 並建立遊戲畫面。

## PixiJS loading page 要怎麼放進 HTML？

PixiJS loading page 可以用一個覆蓋在 canvas 上方的 div 實作。Canvas 負責遊戲畫面，loading div 負責資源載入完成前的狀態提示。

我在 \`index.html\` 中加入：

\`\`\`html
<div id="gameContainer">
  <canvas id="gameCanvas"></canvas>
  <div id="loadingPage">Loading...</div>
</div>
\`\`\`

CSS 讓 loading page 覆蓋整個遊戲容器：

\`\`\`css
#gameCanvas {
  position: absolute;
}

#loadingPage {
  min-width: 100%;
  min-height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background-color: #000000;
  color: #fff;
  text-align: center;
  vertical-align: middle;
  line-height: 100vh;
}
\`\`\`

正式專案建議再補上容器寬高、字體大小與可及性文字，避免只依賴 \`line-height: 100vh\`。

## 如何更新 PixiJS loader 進度？

PixiJS loader 的 \`onProgress\` 會在資源載入進度變化時觸發。畫面可以在回呼中更新 loading page 文字或進度條。

我用 jQuery 更新文字：

\`\`\`javascript
this.loader.onProgress.add((e) => {
  jQuery("#loadingPage").html("Loading..." + Math.floor(e.progress) + "%");
});
\`\`\`

PixiJS v4 的 \`progress\` 是百分比數字。若使用 PixiJS v8 的 \`Assets.load()\`，進度 callback 通常是 \`0\` 到 \`1\` 的比例，升級時要注意數值格式不同。

## 如何處理載入成功與失敗？

PixiJS loader 應同時處理進度、單一資源載入、錯誤與全部完成。只處理成功路徑會讓使用者在資源失敗時卡在 loading page。

整理後的 \`Loader.ts\` 流程如下：

\`\`\`typescript
export class Loader {
  private static loader: PIXI.loaders.Loader;
  private static failedFiles: Array<string> = [];
  private static completedFiles: Array<string> = [];
  public static resources: PIXI.loaders.Resource;

  public static load() {
    this.loader = new PIXI.loaders.Loader();

    ResourcesList.img.forEach((element) => {
      this.loader.add(element.id, element.path);
    });

    this.loader.load((loader, resources) => {
      this.resources = resources;
    });

    this.loader.onProgress.add((e) => {
      jQuery("#loadingPage").html("Loading..." + Math.floor(e.progress) + "%");
    });

    this.loader.onError.add((t, e, r) => {
      this.failedFiles.push(r.name);
    });

    this.loader.onLoad.add((e, t) => {
      this.completedFiles.push(t.name);
    });
  }
}
\`\`\`

這份寫法的資訊增益在於把 loading UI 和資源狀態分開：UI 顯示當下進度，\`failedFiles\` 與 \`completedFiles\` 保留可排錯的載入結果。

## EventEmitter 在 loading 流程中做什麼？

EventEmitter 可以降低 Loader 與 Main 的相依性。Loader 只負責發出「資源載入完成」事件，Main 再決定要隱藏 loading page 或建立遊戲場景。

共用事件物件可以從主程式 export：

\`\`\`typescript
export let eventEmitter: EventEmitter;
\`\`\`

Loader 完成載入後發送事件：

\`\`\`typescript
this.loader.onComplete.add(() => {
  if (this.failedFiles.length === 0) {
    eventEmitter.emit(CoreEvent.AssetsLoadComplete);
  } else {
    jQuery("#loadingPage").html(
      "Loading...failed: could not load " + this.failedFiles
    );
  }
});
\`\`\`

Main 接收事件後建立畫面：

\`\`\`typescript
eventEmitter = new EventEmitter();
eventEmitter.on(CoreEvent.AssetsLoadComplete, () => {
  jQuery("#loadingPage").hide();
  const background = PIXI.Sprite.from(Loader.resources["background"].texture);
  application.stage.addChild(background);
});
\`\`\`

## PixiJS loading page 的維護建議是什麼？

PixiJS loading page 應把 UI、資源清單、錯誤處理與場景切換分開。這樣後續加入重試、進度條或多場景 loading 時比較不會互相牽動。

建議檢查表：

| 檢查項目 | 建議做法 |
|---|---|
| 資源清單 | 集中放在 \`ResourcesList\` 或 manifest |
| 進度顯示 | 用 loader progress 更新文字或進度條 |
| 錯誤顯示 | 顯示失敗資源名稱，不要無限 loading |
| 完成事件 | 用 EventEmitter 或狀態管理通知主場景 |
| 版本升級 | PixiJS v8 優先評估 \`Assets.load()\` |

## 常見問題

### PixiJS loading page 一定要用 jQuery 嗎？

PixiJS loading page 不一定要用 jQuery。我當時用 jQuery 是那個專案的寫法，現代專案可以直接用 DOM API、React state 或其他 UI 框架更新進度。

### \`onProgress\` 的 progress 是 0 到 100 嗎？

PixiJS v4 loader 的 progress 常見為百分比。PixiJS v8 Assets 的 progress callback 則常見為 0 到 1 的比例，升級時要依版本確認。

### loading 完成後為什麼背景圖取不到？

最常見原因是 resource id 與載入清單不一致。確認 \`ResourcesList\` 中的 id 是否叫 \`background\`，以及圖片是否真的載入成功。

### 載入失敗時應該怎麼顯示？

載入失敗時應顯示失敗檔案名稱，並提供重新整理或重試機制。只停在 Loading 文字會讓使用者不知道發生什麼事。

### EventEmitter 有必要嗎？

小型範例可以直接在 callback 中處理完成動作。當 Loader、Main、Scene、UI 分層後，EventEmitter 能降低互相 import 與直接呼叫的耦合。

## 參考資料

- PixiJS Loader API: <https://api.pixijs.io/@pixi/loaders/PIXI/Loader.html>
- PixiJS Assets Guide: <https://pixijs.com/8.x/guides/components/assets>
- EventEmitter3: <https://github.com/primus/eventemitter3>

## 延伸閱讀

- [PixiJS 載入素材教學：Loader、Spritesheet 與進度事件](/post/pixijs-load-assets-loader)：同樣聚焦 PixiJS，可接著比較不同情境的做法。
- [PixiJS 連連看遊戲開始、結束與過關畫面教學](/post/pixijs-link-game-start-end-clear-screens)：同樣聚焦 PixiJS、EventEmitter，可接著比較不同情境的做法。
- [PixiJS 介紹：2D WebGL 遊戲引擎適合做什麼？](/post/pixijs-introduction-2d-webgl-game-engine)：同樣聚焦 PixiJS，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28，依原始 PixiJS loading page 教學整理為可發布的 GEO 技術文章。

`;export{e as default};