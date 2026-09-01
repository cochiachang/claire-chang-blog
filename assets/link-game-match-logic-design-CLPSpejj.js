var e=`---
title: 連連看圖形連線消除邏輯怎麼設計？用三條直線模型找出可消除路徑
description: 說明連連看遊戲的圖形連線消除邏輯：如何用兩轉折、三條直線模型，推導 A、C、D、B 四點搜尋演算法，判斷盤面上任兩點是否可連線消除。
date: 2018-10-20
category: 前端開發
tags: [連連看, 遊戲開發, 演算法, 遊戲邏輯, 消除判斷]
readingTime: 6 分鐘
image: /images/tech/hero_link-game-match-logic-design.webp
imageAlt: 棋盤上多種顏色的方塊整齊排列，象徵連連看遊戲盤面與連線消除邏輯
---


# 連連看圖形連線消除邏輯怎麼設計？用三條直線模型找出可消除路徑

連連看的消除規則是：兩個相同的圖塊之間，連線最多不能超過兩個轉彎，也就是連接的線最多只能由三條直線組成。這篇文章整理我在設計消除邏輯時的發想過程——如何把「兩個轉彎」這個規則轉成具體的搜尋模型，再用程式找出盤面上任意兩點之間可能存在的那條線。

## 連線為什麼最多只有兩個轉彎？

在連連看裡面，連線的線條不可超過兩個轉彎處。「兩個轉彎」的意思，代表連接的線最多只能由**三條直線**來組成。

思考該如何找出這兩點間所存在的那條線時，先觀察一下棋盤：最多三條直線，代表有可能是一條直線、兩條直線或三條直線來做連接。

不論如何，兩個點之間的那條線，一定一邊是從第一個**點(A)開始**，到另一個**點(B)結束**。因此可以視為這兩個點之中，有可能存在 **A 點連出的(C)點**與 **B 點連出的(D)點**，來形成連線。

![A 點與 B 點之間透過 C 點與 D 點連線的示意圖](/images/articles/link-game-match-logic-design-1.webp)

由上圖可以觀察出一個關鍵性質：**A 點連出的(C)點，絕對和開始的(A)點在同一行或同一列；B 點連出的(D)點，絕對和結束的(B)點在同一行或同一列**。這個性質把搜尋空間大幅縮小——我只需要沿著 A、B 各自的行與列去找 C、D，不用對整個盤面做泛搜尋。

## 可能連成的線有哪些形狀？

接著我畫出所有有可能連出來的線圖形狀，再來思考該如何撰寫消除邏輯：

![連連看所有可能連線圖形狀的整理圖](/images/articles/link-game-match-logic-design-2.webp)

把這些形狀整理一下，可以歸納成三類：

| 形狀 | 說明 |
|---|---|
| 一條直線 | A、B 直接同行或同列且中間無阻擋 |
| 一個轉彎 | 兩條直線，A、B 各出一條，交會於一個轉折點 |
| 兩個轉彎 | 三條直線，經過 C、D 兩個轉折點 |

## 如何搜尋可能存在的路徑？

從上面的圖形，先來分析向左、上、下、右的邊消的情況，要如何搜尋可能存在的路徑。先看這張圖：

![單一方向連線搜尋模型：A、C、D、B 四點構成的可能路徑區域](/images/articles/link-game-match-logic-design-3.webp)

圖中的(A)為起始點，(B)為終點，(C)為(A)點最左能走到的點，(D)為(B)點最左能走到的點。淡紅色漸層的部份，就是存在著可能路徑的區域。

這個可能連線區塊的四個角落座標應為：左上(A.x, D.y)、右上(A.x, B.y)、右下(D.x, D.y)、左下(B.x, B.y)。換句話說，我應該要取 A_C 與 B_D 的橫向座標（y）中，**有交集的部份**。

因此這部份的邏輯程式會長這樣：

\`\`\`javascript
let pointC = getPathLeftPoint(pointA);
let pointD = getPathLeftPoint(pointB);
let min = Math.max(pointC.y, pointD.y);
let max = Math.min(pointA.y, pointB.y);
for (var i = max; i >= min; i--) {
    if (!hasMiddleValue(new Point(pointA.x, i), new Point(pointB.x, i))) {
        path = [pointA, new Point(pointA.x, i), new Point(pointB.x, i), pointB];
        return "可消除";
    }
}
\`\`\`

同樣的模型可以套用在向左、向上、向右、向下四個方向。可以發現：

- 左右直連，可視為 A 點與 C 點相疊、B 點與 D 點相疊的向上/向下消除；上下直連亦同。
- 轉折連接，可視為 A 與 C、B 與 D 其中有一組相疊、另一組不相疊。

也就是說，所有基本形狀都可以用同一套「取 C、D，再掃描 y 交集」的演算法來找出路徑。

## 那些套不上模型的圖形怎麼辦？

有兩種圖形無法用上面的方式直接找出來：

![無法用相同模型直接判斷的兩種連線圖形](/images/articles/link-game-match-logic-design-4.webp)

先繪製出有可能可以連線的區域：

![兩轉折連線的可能連線區域示意圖](/images/articles/link-game-match-logic-design-5.webp)

由上圖可知，我需要找 A、B 之間在左邊的(A)點往右可走最多的那個(C)點，然後找在右邊的(B)點往左走最多的(D)點，再取出 A_C 與 B_D 中 y 有交集的地方，那就是有可能可以連線的區域。

這部份的邏輯程式碼為：

\`\`\`javascript
if (pointA.y != pointB.y) {
    let leftPoint = (pointA.y < pointB.y) ? pointA : pointB;
    let rightPoint = (pointA.y >= pointB.y) ? pointA : pointB;
    let leftPointRIGHT = getPathRightPoint(leftPoint);
    let rightPointLEFT = getPathLeftPoint(rightPoint);
    leftPointRIGHT.y = (leftPointRIGHT.y < rightPoint.y) ? leftPointRIGHT.y : rightPoint.y;
    rightPointLEFT.y = (rightPointLEFT.y > leftPoint.y) ? rightPointLEFT.y : leftPoint.y;
    if (leftPointRIGHT.y != leftPoint.y && rightPointLEFT.y != rightPoint.y) {
        for (var i = rightPointLEFT.y; i <= leftPointRIGHT.y; i++) {
            if (!this.board.hasMiddleValue(new Point(leftPoint.x, i), new Point(rightPoint.x, i))) {
                this.path_Detail = [leftPoint, new Point(leftPoint.x, i), new Point(rightPoint.x, i), rightPoint];
                console.log("same left to right");
                return true;
            }
        }
    }
}
\`\`\`

整體設計的重點在於：與其在整個盤面上做盲目搜尋，不如先由「最多三條直線」的規則推導出 C、D 兩個轉折點必然落在 A、B 的行與列上，再把問題縮小成「找兩段可行走的座標區間，並掃描它們的交集」。這樣每組配對的判斷成本只與盤面的寬高成正比，實作上也只需要 \`getPathLeftPoint\`、\`getPathRightPoint\`（找某方向最遠可達點）與 \`hasMiddleValue\`（判斷兩點間是否有阻擋）三個輔助函式。

若想把這套邏輯實際接上畫面，可以參考我後續用 PixiJS 實作盤面與 \`Board\`、\`Path\` 類別的做法；延伸的電腦自動尋找配對版本則進一步處理了路徑搜尋的通用化。

## 常見問題

### 連連看的連線規則是什麼？

兩個相同圖塊之間的連線不能超過兩個轉彎，也就是最多由三條直線組成，且連線經過的格子都必須是空的（不含未消除的圖塊）。

### 為什麼可以把轉折點限制在 A、B 的同行同列上？

因為三條直線的連線中，第一段必須從 A 沿著行或列出發，最後一段必須沿著行或列抵達 B，所以兩個轉折點 C、D 必然分別與 A、B 在同一行或同一列。

### 判斷兩點可否消除的核心步驟是什麼？

先分別找出 A、B 在某方向最遠可達的 C、D 點，取兩段行走區間座標的交集，再逐格掃描交集內的候選路徑，用 \`hasMiddleValue\` 確認中間無阻擋即可判定可消除。

### 這套演算法的複雜度如何？

每一組配對的搜尋範圍被限制在 C、D 兩個轉折點構成的矩形區域內，成本與盤面寬高成正比，遠低於對整個盤面做廣度優先搜尋。

## 參考資料

- 本文為我 2018 年 IT 邦幫忙鐵人賽系列筆記「[5 – 遊戲邏輯] 圖形連線消除邏輯發想」的整理。

## 延伸閱讀

- [PixiJS 如何實作連連看盤面與消除邏輯](/post/pixi-link-game-board)：同樣聚焦 遊戲開發、連連看，可接著比較不同情境的做法。
- [連連看電腦搜尋路徑怎麼做？用符號遍歷找出可行路徑與自動重整盤面](/post/link-game-computer-pathfinding)：同樣聚焦 連連看、遊戲開發，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 遊戲開發、連連看，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-10-20，本文保留原始筆記內容並補上 GEO 結構。
`;export{e as default};