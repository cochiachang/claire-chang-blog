var e=`---
title: 連連看連線消除程式怎麼寫？Angular + TypeScript 實作路徑搜尋邏輯
description: 連連看連線消除程式撰寫教學：遊戲主流程設計、判斷兩圖案是否相同、用 Path 類別實作上下左右與上下連消的路徑搜尋邏輯，附完整 TypeScript 程式碼。
date: 2018-10-21
category: 前端開發
tags: [連連看, TypeScript, Angular, 遊戲開發, 路徑搜尋]
readingTime: 8 分鐘
image: /images/tech/hero_link-game-match-logic-implementation.webp
imageAlt: 連連看遊戲盤面與連線消除路徑示意
---


# 連連看連線消除程式怎麼寫？Angular + TypeScript 實作路徑搜尋邏輯

連連看只要點選兩個圖案，就會判斷能不能消除。消除的條件只有兩個：兩個圖案相同，而且連線不超過兩個轉彎。這篇接續前一篇文章的邏輯發想，把判斷流程實際寫成 Angular + TypeScript 的程式碼：先處理遊戲主流程，再依序實作「判斷圖案相同」與「連線邏輯」兩個部分。

## 連連看的主遊戲流程怎麼設計？

主流程是：玩家先點第一個圖案（代表想消除它），再點第二個圖案，這時判斷兩個圖案是否符合可消除條件，可以消除就把兩個點從盤面上清掉。

流程如下：

![連連看遊戲主流程圖](/images/articles/link-game-match-logic-implementation-1.webp)

對應的 Angular controller 程式碼：

\`\`\`js
var app = angular.module('LianLianKan', []);
app.controller('myCtrl', function ($scope) {
    $scope.select1 = new Point(-1, -1);
    $scope.select2 = new Point(-1, -1);
    $scope.selected = false;
    let msgArra = [];
    $scope.message = msgArra;
    let board = new Board();
    $scope.boardContent = board.board;
    $scope.click = function (x: number, y: number) {
        if ($scope.selected) {
            $scope.select2 = new Point(x, y);
            if (board.hasSameValue($scope.select1, $scope.select2)) {
                if (! ($scope.select1.x == x && $scope.select1.y == y) ) {//確認所選的兩個點不一樣
                    let path = new Path($scope.select1, $scope.select2, board);
                    if(path.canLinkInLine()){
                        board.clearPoint($scope.select1);
                        board.clearPoint($scope.select2);
                        msgArra.push(path);
                    }
                }
            }
            $scope.selected = false;
        } else {
            $scope.select1 = new Point(x, y);
            $scope.selected = true;
        }
    };
});
\`\`\`

## 怎麼判斷兩個圖案是否相同？

在 \`Board\` 類別加上 \`hasSameValue\`，直接比較盤面上兩個座標的值：

\`\`\`js
public hasSameValue(point1: Point, point2: Point): boolean {
    return this.board[point1.x][point1.y] == this.board[point2.x][point2.y];
}
\`\`\`

圖案相同只是第一道關卡，接著才是最核心的連線判斷。

## 連線邏輯（Path 類別）怎麼寫？

新建一個 \`Path\` 類別，\`canLinkInLine()\` 依序嘗試六種連線方式：從上面消、從下面消、從左邊消、從右邊消、左右連消、上下連消。只要其中一種成立，就把路徑存到 \`path_Detail\` 並回傳 true。

\`\`\`js
class Path {
    public point1: Point;
    public point2: Point;
    readonly board: Board;
    public path_Detail: Array<Point>;

    constructor(point1: Point, point2: Point, board: Board) {
        this.point1 = point1;
        this.point2 = point2;
        this.board = board;
    }

    public canLinkInLine(): boolean {
        //從上面消：兩個點都往上找最遠能到達的距離
        let point1UP = this.board.getNearByPointByDirection(this.point1, Direction.UP);
        let point2UP = this.board.getNearByPointByDirection(this.point2, Direction.UP);
        {
            let min = Math.max(point1UP.x, point2UP.x);
            let max = Math.min(this.point1.x, this.point2.x);
            for (var i = max; i >= min; i--) {
                if (!this.board.hasMiddleValue(new Point(i, this.point1.y), new Point(i, this.point2.y))) {
                    this.path_Detail = [this.point1, new Point(i, this.point1.y), new Point(i, this.point2.y), this.point2];
                    return true;
                }
            }
        }
        //從下面消
        let point1DOWN = this.board.getNearByPointByDirection(this.point1, Direction.DOWN);
        let point2DOWN = this.board.getNearByPointByDirection(this.point2, Direction.DOWN);
        {
            let max = Math.min(point1DOWN.x, point2DOWN.x);
            let min = Math.max(this.point1.x, this.point2.x);
            for (var i = min; i <= max; i++) {
                if (!this.board.hasMiddleValue(new Point(i, this.point1.y), new Point(i, this.point2.y))) {
                    this.path_Detail = [this.point1, new Point(i, this.point1.y), new Point(i, this.point2.y), this.point2];
                    return true;
                }
            }
        }
        //從左邊消
        let point1LEFT = this.board.getNearByPointByDirection(this.point1, Direction.LEFT);
        let point2LEFT = this.board.getNearByPointByDirection(this.point2, Direction.LEFT);
        {
            let min = Math.max(point1LEFT.y, point2LEFT.y);
            let max = Math.min(this.point1.y, this.point2.y);
            for (var i = max; i >= min; i--) {
                if (!this.board.hasMiddleValue(new Point(this.point1.x, i), new Point(this.point2.x, i))) {
                    this.path_Detail = [this.point1, new Point(this.point1.x, i), new Point(this.point2.x, i), this.point2];
                    return true;
                }
            }
        }
        //從右邊消
        let point1RIGHT = this.board.getNearByPointByDirection(this.point1, Direction.RIGHT);
        let point2RIGHT = this.board.getNearByPointByDirection(this.point2, Direction.RIGHT);
        {
            let max = Math.min(point1RIGHT.y, point2RIGHT.y);
            let min = Math.max(this.point1.y, this.point2.y);
            for (var i = min; i <= max; i++) {
                if (!this.board.hasMiddleValue(new Point(this.point1.x, i), new Point(this.point2.x, i))) {
                    this.path_Detail = [this.point1, new Point(this.point1.x, i), new Point(this.point2.x, i), this.point2];
                    return true;
                }
            }
        }
        //左右連消
        if (this.point1.y != this.point2.y) {
            //先判斷哪個點在左、哪個點在右
            let leftPoint = (this.point1.y < this.point2.y) ? this.point1 : this.point2;
            let rightPoint = (this.point1.y >= this.point2.y) ? this.point1 : this.point2;
            //取得右邊的點，直線往左最左的那個點
            let leftPointRIGHT = this.board.getNearByPointByDirection(leftPoint, Direction.RIGHT);
            let rightPointLEFT = this.board.getNearByPointByDirection(rightPoint, Direction.LEFT);
            //右邊最左的點不可超過左邊的點，否則會造成誤判
            leftPointRIGHT.y = (leftPointRIGHT.y < rightPoint.y) ? leftPointRIGHT.y : rightPoint.y;
            rightPointLEFT.y = (rightPointLEFT.y > leftPoint.y) ? rightPointLEFT.y : leftPoint.y;
            //用迴圈判斷在所有有可能的範圍中是否有可能存在的路徑
            if (leftPointRIGHT.y != leftPoint.y && rightPointLEFT.y != rightPoint.y) {
                for (var i = rightPointLEFT.y; i <= leftPointRIGHT.y; i++) {
                    if (!this.board.hasMiddleValue(new Point(leftPoint.x, i), new Point(rightPoint.x, i))) {
                        this.path_Detail = [leftPoint, new Point(leftPoint.x, i), new Point(rightPoint.x, i), rightPoint];
                        return true;
                    }
                }
            }
        }
        //上下連消
        if (this.point1.x != this.point2.x) {
            let upPoint = (this.point1.x < this.point2.x) ? this.point1 : this.point2;
            let downPoint = (this.point1.x >= this.point2.x) ? this.point1 : this.point2;
            let upPointDOWN = this.board.getNearByPointByDirection(upPoint, Direction.DOWN);
            let downPointUP = this.board.getNearByPointByDirection(downPoint, Direction.UP);
            upPointDOWN.x = (upPointDOWN.x < downPoint.x) ? upPointDOWN.x : downPoint.x;
            downPointUP.x = (downPointUP.x > upPoint.x) ? downPointUP.x : upPoint.x;
            if (upPointDOWN.x != upPoint.x && downPointUP.x != downPoint.x) {
                for (var i = downPointUP.x; i <= upPointDOWN.x; i++) {
                    if (!this.board.hasMiddleValue(new Point(i, upPoint.y), new Point(i, downPoint.y))) {
                        this.path_Detail = [upPoint, new Point(i, upPoint.y), new Point(i, downPoint.y), downPoint];
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
\`\`\`

## Board 類別要提供哪些方法？

\`Board\` 負責盤面資料與搜尋輔助：產生初始局面（隨機排列 50 個圖案、切成 10×10）、找出某個點往四個方向最遠能到達的直線距離（\`getNearByPointByDirection\`）、判斷兩點之間是否有障礙（\`hasMiddleValue\`）、比較圖案（\`hasSameValue\`）與清掉圖案（\`clearPoint\`）。

\`\`\`js
class Board {
    public board: Array<Array<number>>;

    constructor() {
        let content = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
        //產生初始局面
        let length = 10;
        let data = content.concat(content).concat(content).concat(content).sort((a, b) => (Math.random() > .5) ? 1 : 0);
        this.board = []
        for (var i = 0; i < length; i++) {
            this.board.push(data.slice(i * length, (i + 1) * length))
        }
    }

    //找到這個點四周最遠能到達的直線距離
    public getNearByPointByDirection(point: Point, direction: string): Point {
        let nearByPoint: Point = new Point(point.x, point.y);
        switch (direction) {
            case Direction.UP:
                //搜尋往上走最遠可到達的點
                for (var i = point.x - 1; i >= 0; i--) {
                    if (this.board[i][point.y] == null) {
                        nearByPoint.x = i;
                    } else {
                        break;
                    }
                }
                if (nearByPoint.x == 0) {
                    nearByPoint.x = -1;
                }
                break;
            case Direction.DOWN: {
                //搜尋往下走最遠可到達的點
                let maxLengthDOWN = this.board.length;
                for (var i = point.x + 1; i < maxLengthDOWN; i++) {
                    if (this.board[i][point.y] == null) {
                        nearByPoint.x = i;
                    } else {
                        break;
                    }
                }
                if (nearByPoint.x == maxLengthDOWN - 1) {
                    nearByPoint.x = maxLengthDOWN;
                }
                break;
            }
            case Direction.RIGHT: {
                //搜尋往右走最遠可到達的點
                let maxLengthRIGHT = this.board[0].length;
                for (var i = point.y + 1; i < maxLengthRIGHT; i++) {
                    if (this.board[point.x][i] == null) {
                        nearByPoint.y = i;
                    } else {
                        break;
                    }
                }
                if (nearByPoint.y == maxLengthRIGHT - 1) {
                    nearByPoint.y = maxLengthRIGHT;
                }
                break;
            }
            case Direction.LEFT:
                //搜尋往左走最遠可到達的點
                for (var i = point.y - 1; i >= 0; i--) {
                    if (this.board[point.x][i] == null) {
                        nearByPoint.y = i;
                    } else {
                        break;
                    }
                }
                if (nearByPoint.y == 0) {
                    nearByPoint.y = -1;
                }
                break;
        }
        return nearByPoint;
    }

    //偵測在兩個點中是否可用一條直線做連接
    public hasMiddleValue(a: Point, b: Point): boolean {
        if (a.x == b.x) {
            if (a.x == -1 || a.x == this.board.length) return false;
            let max = Math.max(a.y, b.y);
            let min = Math.min(a.y, b.y);
            for (var i = min + 1; i < max; i++) {
                if (this.board[a.x][i] != null) {
                    return true;
                }
            }
            return false;
        } else if (a.y == b.y) {
            if (a.y == -1 || a.y == this.board[0].length) return false;
            let max = Math.max(a.x, b.x);
            let min = Math.min(a.x, b.x);
            for (var i = min + 1; i < max; i++) {
                if (this.board[i][a.y] != null) {
                    return true;
                }
            }
            return false;
        } else {
            return true;
        }
    }

    //判斷某兩個點的值是否相同
    public hasSameValue(point1: Point, point2: Point): boolean {
        return this.board[point1.x][point1.y] == this.board[point2.x][point2.y];
    }

    //將盤面上的圖消掉
    public clearPoint(point: Point) {
        this.board[point.x][point.y] = null;
        point = null;
    }
}
\`\`\`

左右連消與上下連消是這段邏輯裡最容易寫錯的部分：外側點往內找的最遠距離，一定不能超過內側點，否則會把「繞過內側點背後」的路徑誤判成可連線，所以程式裡刻意用 \`min\`/\`max\` 把搜尋範圍夾住。

## 今日成果

完成後的連連看已經可以真的玩：點選兩個相同圖案，若兩個轉彎內可連到就消除。

![連連看連線消除今日成果](/images/articles/link-game-match-logic-implementation-2.webp)

## 常見問題

### 連連看可消除的條件是什麼？

兩個圖案相同，而且連線不超過兩個轉彎。程式上先把「圖案相同」用 \`hasSameValue\` 過濾掉，再用 \`Path.canLinkInLine()\` 判斷路徑是否存在。

### 為什麼連線搜尋要分六種情況？

因為可連線的路徑最多兩個轉彎，可能出現直線、一個轉彎（L 形）與兩個轉彎（Z 形／U 形）等多種形狀。分別從上下左右單向搜尋可以覆蓋直線與單轉彎；左右連消與上下連消則處理兩個轉彎的情境。

### 左右連消時為什麼要把搜尋範圍夾在兩點之間？

如果外側點往內搜尋超過了內側點的位置，會把繞過內側點背後的路徑誤判成可連線。程式碼裡用 \`leftPointRIGHT.y\`、\`rightPointLEFT.y\` 與兩點座標比較，把搜尋範圍夾住，避免誤判。

### hasMiddleValue 回傳 true 代表什麼？

代表兩點之間「有障礙」、這條直線走不過去。函式在兩點之間掃描，只要中間有任何非 null 的圖案就回傳 true；搜尋路徑時要找的是 \`!hasMiddleValue(...)\` 成立的直線。

### 盤面是怎麼產生的？

把 25 種圖案各複製 4 份共 100 個元素，隨機排序後切成 10×10 的二維陣列。被消除的圖案會把該格設成 null，後續搜尋就能穿過這些空格。

## 參考資料

- 本系列前一篇文章：〈[5 – 遊戲邏輯] 圖形連線消除邏輯發想〉，IT 邦幫忙鐵人賽 2018。
- 專案原始碼：ironman20181021.zip。

## 延伸閱讀

- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 TypeScript、遊戲開發，可接著比較不同情境的做法。
- [連連看電腦搜尋路徑怎麼做？用符號遍歷找出可行路徑與自動重整盤面](/post/link-game-computer-pathfinding)：同樣聚焦 連連看、TypeScript，可接著比較不同情境的做法。
- [PixiJS 如何實作連連看盤面與消除邏輯](/post/pixi-link-game-board)：同樣聚焦 TypeScript、遊戲開發，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-10-21，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};