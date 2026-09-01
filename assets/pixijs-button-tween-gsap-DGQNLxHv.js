var e=`---
title: PixiJS 按鈕 Tween 動態：用 GSAP 做縮放回彈效果
description: 說明 PixiJS 按鈕如何搭配 GSAP Tween 與 Timeline 製作按下、放開與滑出時的互動動畫。
date: 2018-11-06
category: 前端開發
tags: [PixiJS, GSAP, Tween, TypeScript]
readingTime: 8 分鐘
image: /images/tech/hero_pixijs-button-tween-gsap.webp
imageAlt: 網頁遊戲按鈕在互動時產生縮放動畫
---


# PixiJS 按鈕 Tween 動態：用 GSAP 做縮放回彈效果

PixiJS 按鈕可以透過 GSAP 改變 \`scale.x\`、\`scale.y\`、alpha 或位置，做出按下縮小、放開回彈的互動效果。Tween 動畫應封裝在按鈕基底類別，避免每個按鈕重複撰寫事件邏輯。

## GSAP 在 PixiJS 專案中負責什麼？

GSAP 是 JavaScript 動畫函式庫，可以 tween 任何 JavaScript 可控制的數值。PixiJS 顯示物件的 scale、position、rotation 與 alpha 都能交給 GSAP 做時間軸動畫。

GSAP 適合處理：

- 按鈕按下縮放。
- UI 面板滑入滑出。
- 道具或角色提示動畫。
- 多段連續動畫時間軸。
- easing 與 repeat 動畫。

PixiJS 負責渲染畫面，GSAP 負責補間數值。兩者分工清楚時，互動動畫會比手寫 ticker 狀態更容易維護。

## Tween 和 Timeline 差在哪裡？

Tween 適合單一屬性的單段變化，Timeline 適合多段動畫按順序執行。按鈕回彈通常會先放大再回到原尺寸，因此 Timeline 比單一 Tween 更好管理。

舊版 GSAP 範例：

\`\`\`js
TweenLite.to(".grey", 1, { x: 700, rotation: 360, delay: 3, id: "grey" });
\`\`\`

多段動畫範例：

\`\`\`js
var tl = new TimelineMax({ repeat: 2, repeatDelay: 1 });
tl.add(TweenLite.to(element, 1, { scale: 0.9 }));
tl.add(TweenLite.to(element, 1, { scale: 1.1 }));
tl.add(TweenLite.to(element, 1, { scale: 1 }));
\`\`\`

現代 GSAP 專案常使用 \`gsap.to()\` 與 \`gsap.timeline()\`。維護舊程式碼時看到 \`TweenLite\`、\`TweenMax\`、\`TimelineLite\`、\`TimelineMax\`，要先確認 GSAP 版本。

## PixiJS 按鈕要監聽哪些事件？

PixiJS 按鈕通常要同時處理滑鼠與觸控事件。按下時縮小，放開時回彈，滑出時重設比例，可以避免按鈕卡在縮小狀態。

事件設計：

| 事件 | 動作 |
|---|---|
| \`mousedown\` / \`touchstart\` | 按鈕縮小 |
| \`mouseup\` / \`touchend\` | 按鈕放大後回到 1 |
| \`mouseout\` | 重設縮放 |
| \`mouseup\` / \`touchend\` | 觸發按鈕功能 |

互動動畫要短。按鈕回饋若超過 0.2 到 0.3 秒，玩家會感覺介面反應變慢。

## 如何封裝 ButtonBase？

ButtonBase 可以統一設定 texture、interactive、buttonMode、anchor 與動畫事件。每個具體按鈕只要繼承 ButtonBase 並覆寫 \`trigger()\`。

原稿範例整理如下：

\`\`\`ts
import Sprite = PIXI.Sprite;
import { Loader } from "../core/Loader";

declare const TweenLite: any;
declare const TimelineMax: any;

export class ButtonBase extends Sprite {
  constructor(id: string, textureID: string, x: number, y: number) {
    super();
    this.texture = Loader.resources[id].textures[textureID];
    this.interactive = true;
    this.buttonMode = true;
    this.x = x;
    this.y = y;
    this.anchor.set(0.5);

    this.on("mousedown", this.mouseDownEffect.bind(this));
    this.on("mouseup", this.mouseUpEffect.bind(this));
    this.on("mouseout", this.mouseOutEffect.bind(this));
    this.on("touchstart", this.mouseDownEffect.bind(this));
    this.on("touchend", this.mouseUpEffect.bind(this));

    this.on("mouseup", this.trigger.bind(this));
    this.on("touchend", this.trigger.bind(this));
  }

  public trigger() {}

  public set enable(value: boolean) {
    this.interactive = value;
    this.buttonMode = value;
    this.alpha = value ? 1 : 0.5;
  }

  public mouseDownEffect(): void {
    let timeline = new TimelineMax();
    timeline.add(new TweenLite(this, 0.2, {
      scaleX: 0.9,
      scaleY: 0.9,
    }));
    timeline.play();
  }

  public mouseUpEffect(): void {
    let timeline = new TimelineMax();
    timeline.add(new TweenLite(this, 0.1, {
      scaleX: 1.1,
      scaleY: 1.1,
    }));
    timeline.add(new TweenLite(this, 0.1, {
      scaleX: 1,
      scaleY: 1,
    }));
    timeline.play();
  }

  set scaleX(value: number) {
    this.scale.x = value;
  }

  set scaleY(value: number) {
    this.scale.y = value;
  }

  public mouseOutEffect(): void {
    this.scale.set(1, 1);
  }
}
\`\`\`

## 按鈕 Tween 實作要注意哪些問題？

按鈕 Tween 最常見問題是重複觸發導致動畫堆疊。使用者快速連點時，舊 tween 還沒結束，新 tween 又開始，按鈕可能比例異常或觸發多次行為。

建議補強：

1. 新 tween 開始前先 kill 既有 tween。
2. disabled 狀態不要綁定或觸發 click 行為。
3. \`mouseout\`、\`touchcancel\` 要重設狀態。
4. 觸控裝置不要只監聽 mouse event。
5. 動畫與業務邏輯分離，\`trigger()\` 只負責功能。

資訊增益建議：ButtonBase 不只是一個動畫類別，也是一個互動狀態邊界。把 enable、動畫、事件與觸發點集中管理，後續加音效、冷卻時間或防連點都會容易很多。

## 常見問題

### PixiJS 可以直接用 GSAP 嗎？

PixiJS 可以直接用 GSAP。只要目標是 JavaScript 物件上的可寫數值，例如 \`x\`、\`y\`、\`alpha\`、\`scale.x\`，GSAP 就能補間。

### TweenLite 和 GSAP 3 的寫法一樣嗎？

TweenLite 是舊版 GSAP 常見 API。GSAP 3 通常使用 \`gsap.to()\` 與 \`gsap.timeline()\`，維護舊專案時要先確認版本。

### 按鈕縮放時為什麼要設定 anchor？

按鈕縮放若沒有設定 anchor，縮放中心可能在左上角。\`anchor.set(0.5)\` 可以讓按鈕以中心點縮放，互動效果比較自然。

### 為什麼按鈕會卡在縮小狀態？

按鈕卡住通常是因為 mouseup 或 touchend 沒有被觸發，例如游標移出按鈕。應處理 \`mouseout\` 或 \`touchcancel\`，並在事件中重設 scale。

### disabled 按鈕還要播放 Tween 嗎？

disabled 按鈕通常不應播放按下動畫，也不應觸發功能。可在 \`enable\` setter 裡同步設定 \`interactive\`、\`buttonMode\` 與 alpha。

## 參考資料

- GSAP 官方網站：<https://gsap.com/>
- GSAP 安裝文件：<https://gsap.com/docs/v3/Installation/>
- PixiJS 官方網站：<https://pixijs.com/>
- PixiJS Events 文件：<https://pixijs.download/release/docs/events.html>

## 延伸閱讀

- [PixiJS 按鈕製作基礎：Sprite 互動、ButtonBase 與靜音切換](/post/pixijs-button-basics)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 逐格動畫教學：連連看公仔角色動畫實作](/post/pixijs-frame-animation-link-game-character)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 場景設定教學：Application、Canvas 與自動縮放](/post/pixijs-scene-setup)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28

`;export{e as default};