var e=`---
title: 連連看初始盤面產生：用二維陣列建立隨機棋盤與測試畫面
description: 說明連連看初始盤面如何用二維陣列儲存，隨機產生 6x6 測試棋盤，並用 AngularJS table 呈現盤面。
date: 2018-10-19
category: 後端開發
tags: [連連看, JavaScript, AngularJS, TypeScript, 遊戲邏輯]
readingTime: 7 分鐘
image: /images/tech/hero_link-game-algorithm-introduction.webp
imageAlt: 連連看棋盤上的兩點連線路徑，象徵初始盤面生成與遊戲邏輯設計
---


# 連連看初始盤面產生：用二維陣列建立隨機棋盤與測試畫面

連連看初始盤面可以先用二維陣列表示，每一格存放 \`1\` 到 \`N\` 的數字，數字代表不同圖形。開發早期不需要立刻接上美術素材，只要能產生成對資料、打散順序、顯示棋盤，就能開始測試後面的連線消除邏輯。

本文主要查詢是「連連看初始盤面怎麼產生？」變體問題包含「連連看棋盤要用什麼資料結構？」、「如何用 JavaScript 隨機產生 6x6 盤面？」、「AngularJS 怎麼顯示連連看測試棋盤？」、「為什麼連連看圖形數量要成對出現？」資訊增益是把 2018 年連連看系列的測試盤面做成一份可直接理解的盤面生成流程。

## 連連看棋盤要用什麼資料結構？

連連看棋盤適合用二維陣列儲存。二維陣列的第一層可代表列，第二層可代表欄，每個元素存放圖形編號，後續點擊、配對與路徑判斷都能用座標查表完成。

在這個版本裡，我先用一個陣列代表盤面資料，陣列中儲存 \`1\` 到 \`N\` 的數字。每一個數字是一種圖形，之後畫面層可以再把數字對應到不同 icon 或 sprite。

![用陣列表示連連看棋盤內容](/images/tech/link-game-initial-board-generation-array.webp)

這種設計的好處是測試成本低。還沒有角色圖、動畫或消除效果時，只要看到數字分布，就能確認盤面資料是否真的被產生出來，也能先檢查選取兩格時拿到的座標和值是否正確。

## 連連看初始盤面怎麼隨機產生？

連連看初始盤面要先確保每種圖形有偶數個，才可能被配對消除。測試版使用 6x6 棋盤，9 種圖形各出現 4 次，總共正好填滿 36 格。

觀察連連看遊戲，常見設計是同樣的圖形出現四個。若正式盤面是 \`10 x 10\`，總共有 100 個 icon；一種 icon 出現四個時，就會需要 25 種不同 icon。

為了方便測試，我先製作 \`6 x 6 = 36\` 的棋盤。這樣 \`36 / 4 = 9\`，只需要 9 種不同 icon，就能讓每種 icon 都有四個可配對的格子。

\`\`\`js
var boardContent = [1,2,3,4,5,6,7,8,9];

// 產生初始局面
boardContent = boardContent
  .concat(boardContent)
  .concat(boardContent)
  .concat(boardContent)
  .sort(() => Math.random() > .5);

boardContent = [
  boardContent.slice(0,6),
  boardContent.slice(6,12),
  boardContent.slice(12,18),
  boardContent.slice(18,24),
  boardContent.slice(24,30),
  boardContent.slice(30,36)
];
\`\`\`

這段程式的流程很直接：先準備 9 種圖形編號，連續複製四份，再用隨機排序打散，最後切成 6 列，每列 6 個元素。

![隨機產生後的 6x6 連連看盤面資料](/images/tech/link-game-initial-board-generation-random.webp)

若要把這段邏輯放進正式遊戲，建議補兩件事：第一，改用 Fisher-Yates shuffle 取代 \`sort(() => Math.random() > .5)\`；第二，盤面生成後檢查是否至少有一組可消除路徑，避免玩家一開局就遇到無解盤面。

## 盤面產生流程可以怎麼拆？

連連看盤面生成可以拆成四步：決定棋盤大小、決定每種圖形出現次數、打散一維資料、切回二維陣列。這樣拆法讓測試版與正式版可以共用同一個資料模型。

| 步驟 | 目的 | 這篇的測試設定 |
|---|---|---|
| 決定棋盤大小 | 確認總格數 | \`6 x 6 = 36\` |
| 決定圖形種類 | 確認每種圖形可成對 | 9 種圖形 |
| 複製圖形資料 | 讓每種圖形出現固定次數 | 每種出現 4 次 |
| 切成二維陣列 | 對應畫面列與欄 | 6 列，每列 6 格 |

這裡有一個容易忽略的小檢查：總格數必須能被每種圖形的出現次數整除。若設定為每種圖形出現四次，棋盤總格數就要能被 4 整除；否則產生資料時會多出或少掉格子。

## AngularJS 怎麼呈現連連看測試棋盤？

AngularJS 測試畫面可以用 \`ng-repeat\` 讀取二維陣列，將每一列轉成 table row，將每一格轉成 table cell。這種畫面只為驗證邏輯，不是正式遊戲 UI。

在邏輯撰寫版本裡，為了測試方便，我使用 AngularJS 呈現棋盤。AngularJS 的資料綁定能把 \`boardContent\` 直接映射到 HTML table，盤面資料改變時也比較容易看到畫面變化。

HTML 檔案內容如下：

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>JS Bin</title>
  <style>.red{background:red;}</style>
  <script src="https://code.jquery.com/jquery-3.1.0.js"><\/script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.15/angular.min.js"><\/script>
</head>
<body ng-app="myApp" ng-controller="myCtrl">
  select1=<input type="text" ng-model="select1" disabled>
  select2=<input type="text" ng-model="select2" disabled>
  <table border="1" width="200">
    <tr ng-repeat="lines in boardContent track by $index">
      <td ng-repeat="x in lines track by $index"
          ng-class="{'red':(select1[0]==$parent.$index&&select1[1]==$index && selected)}"
          ng-click="click($parent.$index,$index)">{{x}}</td>
    </tr>
  </table>
</body>
</html>
\`\`\`

這段 HTML 的重點是雙層 \`ng-repeat\`。外層跑每一列，內層跑列中的每一格；點擊格子時，把列索引與欄索引傳進 \`click()\`，讓 JavaScript 取得玩家選到的位置。

## 點擊兩格時要記錄哪些狀態？

連連看點擊流程至少要記錄第一次選取座標、第二次選取座標，以及目前是否已經選過第一格。這三個狀態足以測試「兩格是否為相同圖形」。

JavaScript 檔案內容如下：

\`\`\`js
var boardContent = [1,2,3,4,5,6,7,8,9];

// 產生初始局面
boardContent = boardContent
  .concat(boardContent)
  .concat(boardContent)
  .concat(boardContent)
  .sort(() => Math.random() > .5);

boardContent = [
  boardContent.slice(0,6),
  boardContent.slice(6,12),
  boardContent.slice(12,18),
  boardContent.slice(18,24),
  boardContent.slice(24,30),
  boardContent.slice(30,36)
];

// 產生盤面
var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope) {
  $scope.select1 = [-1,-1];
  $scope.select2 = [-1,-1];
  $scope.selected = false;

  $scope.boardContent = boardContent;
  $scope.click = function(x,y) {
    if ($scope.selected) {
      console.log(boardContent[$scope.select1[0]][$scope.select1[1]]);
      console.log(boardContent[x][y]);

      if (boardContent[$scope.select1[0]][$scope.select1[1]] == boardContent[x][y]) {
        $scope.select2 = [x,y];
      }

      $scope.selected = false;
    } else {
      $scope.select1 = [x,y];
      $scope.selected = true;
    }
  };
});
\`\`\`

上面的程式碼會產生一個符合陣列內容的 table 盤面。每一格顯示數字，玩家任選一個數字後，該格會反紅作為提示；若第二次選到的數字與第一次相同，程式會把第二個座標存進 \`select2\`，並把 \`selected\` 設回 \`false\`。

![AngularJS table 顯示連連看初始盤面](/images/tech/link-game-initial-board-generation-table.webp)

測試版目前只判斷兩格數字是否相同，還沒有判斷路徑中間是否被阻擋，也沒有處理最多兩次轉折的連線限制。這是下一階段「圖形連線消除邏輯」要解決的問題。

## 為什麼要把 JS Bin 範例搬到 TypeScript 專案？

TypeScript 專案比較適合承接後續複雜遊戲邏輯。當盤面生成、點擊狀態、路徑搜尋與消除流程越來越多，類別與型別能讓資料邊界更清楚。

JS Bin 很適合快速驗證：寫一段 HTML、貼一段 JavaScript，就能看到盤面資料是否正確。但連連看的後續邏輯會越來越複雜，例如消除條件、搜尋路徑、提示、重整、過關判斷，都不適合長期塞在同一個範例檔裡。

當時整理好的 TypeScript 專案可以下載後執行：

\`\`\`cmd
npm install
\`\`\`

安裝完成後，用下列指令打開網站：

\`\`\`cmd
gulp default
\`\`\`

這個階段的成果不是完成一款遊戲，而是把「盤面資料」從瀏覽器小範例搬到可以繼續擴充的專案結構中。後續加上 Board、Path、GameBoard 等類別時，才不會每改一個規則就牽動整個畫面。

## 常見問題

### 連連看初始盤面為什麼要用二維陣列？

連連看初始盤面用二維陣列，可以自然對應棋盤的列與欄。玩家點擊任一格時，程式只要記錄 \`[row, column]\`，就能查到該格圖形編號並進行配對判斷。

### 連連看每種圖形一定要出現四次嗎？

連連看每種圖形不一定要出現四次，但每種圖形最好出現偶數次，否則最後可能留下無法配對的單張圖形。這篇測試版使用四次，是因為 10x10 正式盤面與 6x6 測試盤面都能剛好整除。

### \`sort(() => Math.random() > .5)\` 適合正式遊戲嗎？

\`sort(() => Math.random() > .5)\` 適合快速示範，不適合正式遊戲。正式遊戲建議改用 Fisher-Yates shuffle，讓洗牌結果比較穩定，也比較容易測試。

### 只檢查兩格數字相同就可以消除嗎？

只檢查兩格數字相同還不夠。連連看還要檢查兩個圖形之間是否存在合法路徑，通常限制為最多兩次轉折，且路徑中不能穿過其他未消除圖形。

### 為什麼先用 AngularJS table，而不是直接用 PixiJS？

AngularJS table 版本適合早期測試資料結構，因為畫面與資料綁定很快就能看出盤面是否正確。等遊戲邏輯穩定後，再用 PixiJS 把數字格子換成圖像、動畫與消除效果。

## 參考資料

- JS Bin 測試範例：<https://jsbin.com/raqilezuye/edit?html,js>

## 延伸閱讀

- [PixiJS 如何實作連連看盤面與消除邏輯](/post/pixi-link-game-board)：同樣聚焦 TypeScript、連連看，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 TypeScript、連連看，可接著比較不同情境的做法。
- [PixiJS 提示與重整按鈕教學：連連看遊戲功能實作](/post/pixijs-hint-refresh-buttons-link-game)：同樣聚焦 TypeScript、連連看，可接著比較不同情境的做法。

## 最後更新

2018-10-19；本文依 2018 年連連看遊戲邏輯筆記整理，保留當時的 JavaScript、AngularJS 與 TypeScript 專案切換脈絡，並補上 GEO 結構。
`;export{e as default};