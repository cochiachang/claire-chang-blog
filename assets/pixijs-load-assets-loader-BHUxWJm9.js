var e=`---
title: PixiJS 載入素材教學：Loader、Spritesheet 與進度事件
description: 整理 PixiJS 載入圖片與 spritesheet 的做法，包含 Loader 事件、錯誤處理與 loading page 判斷。
date: 2018-10-30
category: 前端開發
tags: [PixiJS, Loader, SpriteSheet, TypeScript]
readingTime: 8 分鐘
image: /images/tech/hero_pixijs-load-assets-loader.webp
imageAlt: 網頁遊戲正在載入圖片素材與 spritesheet
---


# PixiJS 載入素材教學：Loader、Spritesheet 與進度事件

PixiJS 遊戲專案不應等到畫面需要圖片時才載入素材。比較穩定的做法是先集中定義資源清單，透過 loader 載入圖片與 spritesheet，等 \`onComplete\` 後再進入遊戲畫面。

## 為什麼不能只用 Sprite 直接載入圖片？

PixiJS 可以用 Sprite 從單張圖片建立顯示物件，但這種方式不適合管理完整遊戲素材。遊戲通常需要先載完背景、角色、按鈕、spritesheet 與音效，否則進入場景時可能出現空白或破圖。

舊版 PixiJS 常見寫法：

\`\`\`js
var bunny = PIXI.Sprite.fromImage('required/assets/basics/bunny.png')
\`\`\`

這種寫法適合單張圖片測試，不適合 spritesheet 與 loading page。正式專案應集中管理資源，避免每個元件各自發 request。

## PixiJS Loader 怎麼載入素材？

PixiJS Loader 可以把多個資源排入佇列，並在載入完成後取得 resources。Loader 也能回報進度、單檔完成、錯誤與全部完成事件。

舊版 PixiJS loader 範例：

\`\`\`js
const loader = new PIXI.loaders.Loader();

loader
  .add('bunny', 'data/bunny.png')
  .add('spaceship', 'assets/spritesheet.json');

loader.load((loader, resources) => {
  // resources.bunny
  // resources.spaceship
});
\`\`\`

PixiJS 版本更新後，API 名稱可能改為 Assets 或其他載入流程。閱讀舊專案時，要先確認專案使用的 PixiJS major version，再對照對應文件。

## Loader 事件各代表什麼？

Loader 事件可以讓 loading page 顯示進度，也能讓開發者記錄失敗檔案。即使中間有檔案失敗，\`onComplete\` 仍可能被呼叫，因此錯誤清單需要自己保存。

常見事件：

| 事件 | 觸發時機 | 用途 |
|---|---|---|
| \`onProgress\` | 載入進度更新 | 更新 loading bar |
| \`onError\` | 某個檔案載入失敗 | 記錄失敗清單、顯示錯誤 |
| \`onLoad\` | 單一資源載入完成 | 記錄完成檔案 |
| \`onComplete\` | 佇列全部處理完成 | 判斷是否進入遊戲 |

原稿觀察到一個實務細節：載入 spritesheet JSON 時，可能會看到 \`onLoad\` 觸發兩次，一次是 JSON，一次是 JSON 指向的 PNG。

## 如何建立 TypeScript 資源清單？

TypeScript 專案可以用一個 \`ResourcesList.ts\` 集中定義 id 與 path。這樣遊戲元件只依賴資源 id，不需要散落硬編碼路徑。

範例：

\`\`\`ts
class Resources {
  public id: string;
  public path: string;

  constructor(id: string, path: string) {
    this.id = id;
    this.path = path;
  }
}

export class ResourcesList {
  public static img = [
    new Resources('bunny', 'assets/bunny.png'),
    new Resources('background', 'assets/background.png'),
    new Resources('Button', 'assets/Button.json'),
    new Resources('Character_Idle', 'assets/Character_Idle.json'),
    new Resources('Character_Jump', 'assets/Character_Jump.json'),
    new Resources('Character_Laugh', 'assets/Character_Laugh.json'),
    new Resources('Icon', 'assets/Icon.json'),
  ];
}
\`\`\`

這種清單也方便之後做 preload 分層，例如共用 UI 先載入、關卡素材進入關卡前再載入。

## 如何封裝 Loader 類別？

封裝 Loader 類別可以集中處理進度、錯誤與完成狀態。遊戲入口只需要呼叫 \`Loader.load()\`，不需要知道每個素材的載入細節。

範例：

\`\`\`ts
import { ResourcesList } from "./ResourcesList";

export class Loader {
  private static loader: PIXI.loaders.Loader;
  private static failedFiles: Array<string> = [];
  private static completedFiles: Array<string> = [];
  public static resources: PIXI.loaders.Resource;

  public static load() {
    this.loader = new PIXI.loaders.Loader();

    ResourcesList.img.forEach(element => {
      this.loader.add(element.id, element.path);
    });

    this.loader.load((loader, resources) => {
      this.resources = resources;
    });

    this.loader.onProgress.add(event => {
      console.log("onProgress: ", event);
    });

    this.loader.onError.add((target, event, error) => {
      this.failedFiles.push(error.name);
      console.log("onError: ", error);
    });

    this.loader.onLoad.add((event, target) => {
      this.completedFiles.push(target.name);
      console.log("onLoad: ", target);
    });

    this.loader.onComplete.add(() => {
      if (this.failedFiles.length === 0) {
        console.log("all file completed");
      } else {
        console.log("Loading failed: could not load " + this.failedFiles);
      }
    });
  }
}
\`\`\`

資訊增益建議：loading page 的完成條件不應只看 \`onComplete\`，也要看 \`failedFiles.length\`。否則檔案失敗時遊戲仍進入主畫面，錯誤會變成後續空 texture 或 undefined resource。

## 常見問題

### PixiJS 單張圖片可以不用 loader 嗎？

單張圖片測試可以不用 loader。正式遊戲專案建議使用集中載入流程，避免進場後才發現素材尚未完成下載。

### PixiJS 載入 spritesheet 為什麼會觸發多次 onLoad？

Spritesheet 通常包含 JSON 與實際貼圖檔案。Loader 可能分別回報 JSON 與圖片載入完成，因此開發時應以整體完成事件與 resources 狀態為準。

### onComplete 代表所有素材都成功嗎？

onComplete 代表載入佇列已處理完，不一定代表所有素材都成功。應另外記錄 \`onError\`，在進入遊戲前檢查失敗清單。

### PixiJS 新版還能用 PIXI.loaders 嗎？

PixiJS 新版載入 API 已和舊版不同。維護舊專案時先看版本；新專案應以目前官方 Assets 文件為準。

### loading bar 的進度應該怎麼算？

loading bar 可使用 loader 的 progress 資訊，但要搭配錯誤狀態。若某些資源可選，則應把必要資源與選用資源分開計算。

## 參考資料

- PixiJS 官方文件：<https://pixijs.com/>
- PixiJS Assets 文件：<https://pixijs.download/release/docs/assets.Assets.html>
- resource-loader GitHub：<https://github.com/englercj/resource-loader>

## 延伸閱讀

- [PixiJS 如何控制 loading page 與載入進度](/post/pixi-loading-page-control)：同樣聚焦 PixiJS，可接著比較不同情境的做法。
- [PixiJS 遊戲素材處理：Adobe Animate 匯出 SpriteSheet 與圖片集](/post/link-game-asset-processing)：同樣聚焦 PixiJS，可接著比較不同情境的做法。
- [PixiJS 場景設定教學：Application、Canvas 與自動縮放](/post/pixijs-scene-setup)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};