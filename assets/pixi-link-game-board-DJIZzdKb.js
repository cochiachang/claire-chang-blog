var e=`---
title: PixiJS 如何實作連連看盤面與消除邏輯
description: 說明 PixiJS 連連看盤面的 Container、Sprite、Board、Path 與兩轉折連線判斷實作方式。
date: 2018-11-03
category: 前端開發
tags: [PixiJS, TypeScript, 遊戲開發, 連連看]
readingTime: 9 分鐘
image: /images/tech/hero_pixi-link-game-board.webp
imageAlt: 彩色圖塊排列在棋盤格上，象徵 PixiJS 連連看盤面與消除路徑判斷
---


# PixiJS 如何實作連連看盤面與消除邏輯

PixiJS 連連看盤面可以用 \`Container\` 管理格子與角色圖，用 \`Sprite\` 或 \`AnimatedSprite\` 顯示每個圖塊，再把盤面資料交給 \`Board\` 與 \`Path\` 判斷兩個點是否能在最多兩次轉折內連線消除。

## PixiJS 盤面需要哪些顯示物件？

PixiJS 盤面最常用的顯示物件是 \`Container\`、\`Sprite\` 與 \`AnimatedSprite\`。\`Container\` 負責分組，\`Sprite\` 顯示靜態圖，\`AnimatedSprite\` 顯示逐格動畫。

我先建立顯示層概念：

\`\`\`javascript
let container = new PIXI.Container();
container.addChild(sprite);
\`\`\`

PixiJS 官方文件把 asset loading、texture、sprite、spritesheet 與 cache 視為遊戲畫面建立的基礎。連連看盤面若有多個角色圖，通常會用 spritesheet 載入後，再依盤面數字挑出對應 texture。

## 連連看的資料盤面怎麼建立？

連連看盤面需要一份二維陣列表示每格內容。相同數字代表同一種圖塊，\`null\` 代表已消除或空格。

我寫的 \`Board\` 類別用 25 種內容各複製多次，再打散成 10x10 盤面：

\`\`\`typescript
export class Board {
  public board: Array<Array<number>>;

  constructor() {
    const content = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24,
    ];
    const length = 10;
    const data = content
      .concat(content)
      .concat(content)
      .concat(content)
      .sort(() => (Math.random() > 0.5 ? 1 : -1));

    this.board = [];
    for (let i = 0; i < length; i++) {
      this.board.push(data.slice(i * length, (i + 1) * length));
    }
  }
}
\`\`\`

正式遊戲要避免 \`sort(() => Math.random() > .5)\` 這類不穩定洗牌，建議改用 Fisher-Yates shuffle，並在生成後檢查盤面是否至少有一組可消除路徑。

## Path 類別如何判斷兩個圖塊可連線？

連連看連線判斷的核心是檢查兩點之間是否能用直線、一次轉折或兩次轉折連通。\`Path\` 類別應回傳是否可消除，以及實際連線座標。

我寫的 \`Path.canLinkInLine()\` 主要分成六種方向檢查：

- 從上方繞線。
- 從下方繞線。
- 從左側繞線。
- 從右側繞線。
- 左右方向連消。
- 上下方向連消。

判斷邏輯會搭配 \`Board.hasMiddleValue(pointA, pointB)\` 檢查兩點之間是否有阻擋。若路徑成立，就把 \`path_Detail\` 設為 \`[起點, 轉折點一, 轉折點二, 終點]\`，讓畫面層可以用 Graphics 畫出連線。

## Board 還需要哪些輔助方法？

Board 不只保存二維陣列，還需要查找同值位置、判斷遊戲是否結束、尋找第一組可消除路徑與取得某方向最近阻擋點。

實作上常見方法如下：

| 方法 | 用途 |
|---|---|
| \`gameRoundEnd()\` | 檢查盤面是否全部消除 |
| \`getPositionByValue(value)\` | 找出同一圖塊的所有座標 |
| \`getFirstExistPath()\` | 找提示功能可用的一組路徑 |
| \`hasMiddleValue(a, b)\` | 判斷兩點直線之間是否有阻擋 |
| \`getNearByPointByDirection(point, direction)\` | 找某方向可延伸到哪裡 |

這種拆法的好處是顯示層不用理解所有消除規則。PixiJS 只負責把使用者點擊轉成座標，再呼叫 Board/Path 得到結果。

## PixiJS 畫面如何套入連線邏輯？

PixiJS 畫面層應把盤面數字轉成 sprite，點擊兩個 sprite 後交給 Path 判斷，若可消除就移除 sprite 並畫出短暫連線效果。

建議互動流程：

1. 建立 \`Board\` 資料。
2. 依 \`board[x][y]\` 產生對應 sprite。
3. 每個 sprite 設定 \`interactive\` 與 click handler。
4. 記錄第一次選取座標。
5. 第二次選取時建立 \`Path(point1, point2, board)\`。
6. 若 \`canLinkInLine()\` 成立，將兩格設為 \`null\`，並移除或播放消除動畫。
7. 依 \`path_Detail\` 用 \`PIXI.Graphics\` 畫連線。

## 常見問題

### PixiJS 連連看盤面要用 Container 嗎？

PixiJS 連連看盤面建議用 Container。Container 可以集中管理棋盤、角色圖塊、連線效果與 UI 按鈕，後續切換場景也比較方便。

### Sprite 和 AnimatedSprite 差在哪裡？

Sprite 顯示單張 texture，適合靜態圖塊。AnimatedSprite 會播放多張 texture，適合角色待機、消除或提示動畫。

### 連連看最多兩次轉折怎麼判斷？

常見做法是先判斷直線，再判斷一次轉折，最後判斷兩次轉折。我的做法是沿上下左右延伸，找出能避開阻擋物的中繼點。

### 盤面生成後一定有解嗎？

隨機生成不保證一定有解。正式遊戲應在生成後呼叫 \`getFirstExistPath()\`，若沒有可消除路徑就重新洗牌。

### PixiJS v4 的 loader 和 PixiJS v8 的 Assets 一樣嗎？

PixiJS v4 常見寫法是 \`PIXI.loader\` 或 \`PIXI.loaders.Loader\`。PixiJS v8 主要使用 \`Assets.load()\`，但進度回呼與資源快取的概念相同。

## 參考資料

- PixiJS Assets Guide: <https://pixijs.com/8.x/guides/components/assets>
- PixiJS Loader API: <https://api.pixijs.io/@pixi/loaders/PIXI/Loader.html>
- PixiJS Sprite documentation: <https://pixijs.download/release/docs/PIXI.Sprite.html>

## 延伸閱讀

- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS 提示與重整按鈕教學：連連看遊戲功能實作](/post/pixijs-hint-refresh-buttons-link-game)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。
- [PixiJS Graphics 連線效果教學：連連看選取框與路徑繪製](/post/pixijs-link-line-graphics)：同樣聚焦 PixiJS、TypeScript，可接著比較不同情境的做法。

## 最後更新

本文最後更新於 2026-08-28，依原始 PixiJS 連連看盤面實作整理為可發布的 GEO 技術文章。

`;export{e as default};