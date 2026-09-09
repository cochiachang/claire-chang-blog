var e=`---
title: 連連看電腦搜尋路徑怎麼做？用符號遍歷找出可行路徑與自動重整盤面
description: 連連看死局判斷與電腦搜尋路徑實作：遍歷盤面、記錄已搜尋符號、列出相同圖案的排列組合，並自動偵測無路徑時重整盤面，附完整 TypeScript 程式碼。
date: 2018-10-22
category: 前端開發
tags: [連連看, TypeScript, 路徑搜尋, 遊戲開發, 演算法]
readingTime: 6 分鐘
image: /images/tech/hero_link-game-computer-pathfinding.webp
imageAlt: 連連看電腦自動搜尋可消除路徑的流程示意
---


# 連連看電腦搜尋路徑怎麼做？用符號遍歷找出可行路徑與自動重整盤面

連連看盤面有可能出現死局——沒有任何兩個圖案能在兩個轉彎內連起來。這時需要讓電腦自動判斷這種狀況並做出反應（例如自動重整盤面），玩家才能明確知道還有沒有可行路徑。這篇接續前面的連線邏輯，實作電腦自動搜尋路徑：遍歷盤面、避免重複搜尋、列出相同圖案的兩兩組合，最後把搜尋結果應用到「死局自動重整」上。

## 怎麼判斷盤面上是否存在任一條可消除路徑？

條件有兩個：

1. 電腦能夠判斷連線是否合法（前一篇文章的 \`Path.canLinkInLine()\` 已完成）。
2. 遍歷所有可能的圖案組合，確認是否存在可能路徑。

第一點已經完成，所以這篇的重點是找一個省時的方式，遍歷所有可能的連線。

## 搜尋邏輯是怎麼構思的？

下圖是我思考電腦自動搜尋時的邏輯草圖：

![電腦自動搜尋路徑的邏輯草圖](/images/articles/link-game-computer-pathfinding-1.webp)

我希望電腦搜尋時能**避免搜尋已搜尋過的路徑**，因此要記錄已搜尋過的組合。為了方便紀錄與判別，我決定以「圖案」為搜尋依據：從盤面最左上開始，每遇到一個符號，就判斷該符號是否有任何可能連線的兩個圖案。

所以需要做到四件事：

1. 遍歷盤面，並在找到路徑時停止搜尋
2. 紀錄已搜尋過的符號，避免重複搜尋
3. 列出現有符號兩兩連線的所有排列組合
4. 判別兩點間能否連線（上一篇文章已完成）

## 搜尋路徑的程式怎麼寫？

\`getFirstExistPath()\` 回傳第一條搜尋到的存在路徑：由盤面最左上開始，每遇到一個還沒搜尋過的符號，就取得盤面上該符號的所有位置，逐組嘗試排列組合是否可連線。

\`\`\`js
//取得第一條搜尋到的已知存在路徑
public getFirstExistPath(): Path {
    var searchedValue = [];//用以紀錄已搜尋過符號
    //由最左上開始做判斷
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board[i].length; j++) {
            let value = this.board[i][j];
            //判斷盤面上現在是有符號的（null 代表沒有符號）
            //並且這個符號之前還沒有被搜尋過
            if (value != null && searchedValue.indexOf(value) == -1) {
                searchedValue.push(value);
                let positionsArr = this.getPositionByValue(value);//取得盤面上所有這個符號的位置
                let permutationsArr = this.getPairNumPermutations(positionsArr.length);
                //getPairNumPermutations 回傳的格式是[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]，裡面數字為 index
                //嘗試每一個可能的排列組合
                for (var k = 0; k < permutationsArr.length; k++) {
                    let v = permutationsArr[k];
                    let path = new Path(positionsArr[v[0]], positionsArr[v[1]], this);
                    if (path.canLinkInLine()) {
                        return path;
                    }
                }
            }
        }
    }
    return null;
}
\`\`\`

\`getPositionByValue\` 取得盤面上所有該符號的位置：

\`\`\`js
public getPositionByValue(value: number): Array<Point> {
    let arr = new Array<Point>();
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board[i].length; j++) {
            if (this.board[i][j] == value) {
                arr.push(new Point(i, j));
            }
        }
    }
    return arr;
}
\`\`\`

## 怎麼列出相同圖案兩兩配對的所有組合？

\`getPairNumPermutations\` 列出相同圖案任選 2 個的所有排列組合。傳入 4 就是 C4 取 2 = 6 種組合。因為兩點間能否連線不受先後順序影響，而且相同的點不能連線，所以用 \`i != j && i <= j\` 排除重複組合：

\`\`\`js
private pairNumPermutations = {};
/**
 * 取得輸入的 index 中，2 個 2 個一組的所有可能排列組合
 * 回傳的格式是 [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]
 */
public getPairNumPermutations(num: number) {
    if (this.pairNumPermutations[num] != null) {
        return this.pairNumPermutations[num];
    }
    let data = [];
    for (var i = 0; i < num; i++) {
        for (var j = 0; j < num; j++) {
            if (i != j && i <= j) {
                data.push([i, j]);
            }
        }
    }
    this.pairNumPermutations[num] = data;
    return data;
}
\`\`\`

同樣的符號有 4 個時，輸入值為 4，輸出就是 \`[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]\` 六種組合。組合的數學背景可參考維基百科的[排列組合](https://zh.wikipedia.org/wiki/%E7%B5%84%E5%90%88)條目。

## 找不到路徑時怎麼自動重整盤面？

搜尋功能可以用在兩個地方：遊戲過關判定，以及死局自動重整。當盤面上沒有任何可走的路時，自動重整盤面：

\`\`\`js
//判斷還有沒有路走
if (board.gameRoundEnd()) {
    alert("恭喜完成遊戲!");
    board = new Board();
    vm.boardContent = board.board;
} else if (board.getFirstExistPath() == null) {
    vm.reloadTimes++;
    board.rearrangeBoard();//重整盤面
}
\`\`\`

重整盤面的做法是：先把盤面上現有的所有圖案收集起來（\`getAllValueInBoard()\`），隨機打亂順序後，再依序填回盤面上所有有圖案的格子——這樣可以重整盤面，又不會影響到已清空的格子的位置。

\`\`\`js
public rearrangeBoard() {
    let values = this.getAllValueInBoard().sort((a, b) => (Math.random() > .5) ? 1 : 0);
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board[i].length; j++) {
            if (this.board[i][j] != null) {
                this.board[i][j] = values.pop();
            }
        }
    }
}
private getAllValueInBoard() {
    let values = [];
    for (var i = 0; i < this.board.length; i++) {
        for (var j = 0; j < this.board[i].length; j++) {
            if (this.board[i][j] != null) {
                values.push(this.board[i][j]);
            }
        }
    }
    return values;
}
\`\`\`

## 今日成果

連連看遊戲邏輯至此大致完成，盤面已具備死局偵測與自動重整的能力。下一篇開始實際製作具有畫面、音效、特效的完整網頁連連看遊戲。

![連連看電腦搜尋路徑今日成果畫面](/images/articles/link-game-computer-pathfinding-2.webp)

## 常見問題

### 連連看為什麼會出現死局？

因為盤面是隨機產生的，有可能剩下的圖案沒有任何兩個能在兩個轉彎內連接。這時需要電腦自動判斷並做出反應，例如自動重整盤面，玩家才能繼續遊戲。

### 電腦搜尋可消除路徑的基本條件是什麼？

兩個：一是電腦能判斷連線是否合法（前一篇文章的 \`Path.canLinkInLine()\`），二是能遍歷盤面上所有圖案的兩兩組合，確認是否存在任何一條可能路徑。

### 為什麼以圖案（符號）為搜尋依據而不是以位置？

以圖案為單位可以記錄「已搜尋過的符號」，避免同一種符號重複搜尋，大幅減少重複的配對判斷，搜尋比較省時。

### getPairNumPermutations 為什麼要排除重複組合？

因為兩點的路徑不受先後順序影響（A 連 B 與 B 連 A 等價），且相同的點不能連線，所以用 \`i != j && i <= j\` 只保留 index 由小到大的組合，把 C(n,2) 的數量剛好列出一次。

### 死局時的重整盤面是怎麼做的？

先把盤面上所有剩餘圖案收集成陣列，隨機打亂後依序填回所有非空格子。這樣只會重排現有圖案的位置，不會影響空格分布。

## 參考資料

- 本系列前一篇文章：〈[6 – 遊戲邏輯] 連線消除程式撰寫〉，IT 邦幫忙鐵人賽 2018。
- 維基百科，〈[排列組合](https://zh.wikipedia.org/wiki/%E7%B5%84%E5%90%88)〉。
- 專案原始碼：ironman20181022.zip。

## 延伸閱讀

- [連連看連線消除程式怎麼寫？Angular + TypeScript 實作路徑搜尋邏輯](/post/link-game-match-logic-implementation)：同樣聚焦 連連看、TypeScript，可接著比較不同情境的做法。
- [PixiJS 如何實作連連看盤面與消除邏輯](/post/pixi-link-game-board)：同樣聚焦 TypeScript、遊戲開發，可接著比較不同情境的做法。
- [連連看遊戲開發前言：從規則、益智遊戲定位到 PixiJS 製作規劃](/post/link-game-development-introduction)：同樣聚焦 TypeScript、遊戲開發，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-10-22，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};