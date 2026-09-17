var e=`---
title: LeetCode 2218 Maximum Value of K Coins From Piles 解題筆記
description: 整理 LeetCode 2218 的取硬幣問題，保留當時的遞迴解法，說明為什麼 k 變大會爆記憶體，以及應改用動態規劃。
date: 2022-10-06
category: 後端開發
tags: [LeetCode, JavaScript, 動態規劃, 演算法]
readingTime: 7 分鐘
image: /images/tech/hero_genomic-range-query-prefix-sums.webp
imageAlt: 演算法前綴和與查詢流程示意圖
---


# LeetCode 2218 Maximum Value of K Coins From Piles 解題筆記

LeetCode 2218 Maximum Value of K Coins From Piles 的核心是：從多疊硬幣中剛好取出 \`k\` 枚，而且每次只能拿每疊最上面的硬幣，最後要讓總價值最大。當時的遞迴解法能表達「每一步從哪一疊拿」的搜尋樹，但在 LeetCode 題目限制下，\`n\` 最多 1000、硬幣總數最多 2000，暴力展開節點很快會遇到記憶體與遞迴深度問題（LeetCode，題目頁存取日期：2026-08-28）。

## LeetCode 2218 要解的是什麼問題？

LeetCode 2218 要求在多疊硬幣中剛好取 \`k\` 枚，且每疊只能從上往下拿。這種限制讓問題不能只挑全域最大值，必須考慮每疊硬幣的前綴總和。

題目輸入是 \`piles\` 與 \`k\`。\`piles[i]\` 代表第 \`i\` 疊硬幣由上到下的價值，選擇某一疊的第 \`j\` 枚硬幣以前，必須先拿走同一疊上方的所有硬幣。

因此，比較合理的拆法不是「每一枚硬幣要不要拿」，而是「第 \`i\` 疊要拿 0 枚、1 枚、2 枚……最多拿到該疊長度或剩餘 \`k\` 枚」。這個觀察會把搜尋空間整理成動態規劃可以處理的狀態。

## 當時的遞迴解法為什麼會爆記憶體？

當時的遞迴解法把每一次取硬幣都建成一個節點，節點裡還保存 parent、children 與每疊目前取到的位置。當 \`k\` 變大時，搜尋樹分支數膨脹，記憶體會先被節點資料吃掉。

下面保留我當時的筆記中的遞迴寫法。這段程式的想法很直覺：每個 \`node\` 代表目前已經取出的硬幣狀態，再往下枚舉下一枚可以從哪一疊取。

\`\`\`js
/**
* @param {number[][]} piles
* @param {number} k
* @return {number}
*/
var maxValueOfCoins = function (piles, k) {
let rootNode = new node(piles.length, k);
let maxResult = addAllChildrenForThisNode(rootNode, piles, 0);
console.log(rootNode.toObject())
return maxResult
};
function addAllChildrenForThisNode(node, piles, maxResult) {
for (let i = 0; i < node.pilesPointer.length; i++) {
if (node.pilesPointer[i] + 1 < piles[i].length) {
let y = node.pilesPointer[i] + 1;
let newNode = node.addChild(piles[i][y], i, y);
console.log(newNode.deep)
if(newNode.deep < newNode.maxSelectNum){
maxResult = addAllChildrenForThisNode(newNode, piles, maxResult)
}else{
maxResult = Math.max(newNode.currentValue, maxResult)
}
}
}
return maxResult
}
function node(pilesNum, maxSelectNum) {
this.currentValue = 0;
//樹的鏈結資料
this.deep = 0;
this.parent = undefined;
this.children = [];
//x代表在哪個piles, y代表在該piles的深度
this.indexX = undefined;
this.indexY = undefined;
//用來儲存這個node位置所有的piles的y座標
this.pilesPointer = new Array(pilesNum).fill(-1);
this.maxSelectNum = maxSelectNum;
this.addChild = function (num, indexX, indexY) {
let child = new node(this.pilesPointer.length, this.maxSelectNum);
child.deep = this.deep + 1;
child.parent = this;
child.currentValue = this.currentValue + num;
child.indexX = indexX;
child.indexY = indexY;
child.pilesPointer = this.pilesPointer.slice(0);
child.pilesPointer[child.indexX] = indexY;
this.children.push(child);
return child
}
this.toObject = function () {
let children = [];
for (let child of this.children) {
children.push(child.toObject())
}
return {deep:this.deep, value: this.currentValue , children: children}
}
}

console.log(maxValueOfCoins([[80,62,78,78,40,59,98,35],[79,19,100,15],[79,2,27,73,12,13,11,37,27,55,54,55,87,10,97,26,78,20,75,23,46,94,56,32,14,70,70,37,60,46,1,53]],5))
\`\`\`

我當時的筆記裡的判斷是對的：「我可能存太多垃圾資訊，當 \`k\` 值變大之後，會發生 heap allocation 錯誤；也受限於遞迴的限制，當 \`k\` 變大效率非常差」。問題不只在遞迴，而是在每條路徑都被具象化成節點，還保留整棵 children tree。

## 這題應該怎麼改成動態規劃？

LeetCode 2218 適合用動態規劃處理：\`dp[x]\` 表示目前處理過的硬幣疊中，剛好取 \`x\` 枚硬幣可得到的最大價值。每加入一疊硬幣，就用該疊前綴和更新狀態。

先把每一疊的前綴和算出來，例如 \`[1, 100, 3]\` 的前綴選項是拿 0 枚得 0、拿 1 枚得 1、拿 2 枚得 101、拿 3 枚得 104。接著逐疊更新 \`dp\`。

狀態轉移可以寫成：

\`\`\`text
newDp[takeTotal] = max(newDp[takeTotal], dp[previousTake] + prefix[currentPileTake])
\`\`\`

其中 \`previousTake + currentPileTake = takeTotal\`。這樣不需要保存搜尋樹，只保存「取到某個數量時的最佳總和」。在題目總硬幣數最多 2000 的限制下，這比建立所有取法節點穩定很多。

## 遞迴搜尋與動態規劃差在哪裡？

遞迴搜尋枚舉的是取硬幣的順序與路徑；動態規劃保留的是同一取幣數量下的最佳結果。LeetCode 2218 只問最大總價值，不問實際取幣順序，所以動態規劃更貼近題目需求。

| 比較項目 | 當時的遞迴搜尋 | 動態規劃 |
|---|---|---|
| 保存內容 | 每個節點、parent、children、每疊指標 | 每個取幣數量的最佳值 |
| 主要風險 | 分支爆炸、heap allocation、遞迴深度 | 需要正確處理前綴和與狀態更新方向 |
| 適合用途 | 理解搜尋空間 | 通過 LeetCode 大測資 |
| 這題建議 | 可當草稿與除錯思路 | 應作為正式解法 |

我會把當時的遞迴解法視為「把問題畫出來」的版本。真正要送 LeetCode 時，應該改成一維或二維 DP，避免把所有路徑都存下來。

## 實作時要注意哪些邊界條件？

LeetCode 2218 的邊界條件集中在「剛好取 \`k\` 枚」與「每疊只能取前綴」。動態規劃實作若允許跳過取幣數量，或把同一疊重複更新，就會得到不合法答案。

整理成檢查清單比較不容易漏：

1. 每疊都要包含「取 0 枚」這個選項。
2. 單疊最多只能取到 \`Math.min(pile.length, k)\` 枚。
3. 更新同一輪時要用 \`newDp\`，避免同一疊被重複使用。
4. \`dp[0]\` 應初始化為 0，其餘狀態可用負無限大或不可達標記。
5. 最後回傳 \`dp[k]\`，不是 \`dp\` 中任意最大值。

這些規則看起來細，但剛好對應當時的遞迴解法遇到的問題：不要保存路徑本身，只保存每個取幣數量的最佳結果。

## 常見問題

### Maximum Value of K Coins From Piles 可以用貪心法解嗎？
Maximum Value of K Coins From Piles 不適合用單純貪心法。因為每疊硬幣只能從上往下拿，某個高價硬幣可能被低價硬幣壓在下面，不能直接挑全域最大值。

### LeetCode 2218 為什麼需要前綴和？
LeetCode 2218 需要前綴和，是因為從同一疊拿 \`j\` 枚硬幣時，總價值一定是前 \`j\` 枚的加總。先算前綴和後，動態規劃就能快速比較每疊拿不同枚數的結果。

### 當時的遞迴解法錯在哪裡？
當時的遞迴解法的方向不是完全錯，而是資料結構太重。每個節點都存 parent、children 與 pilesPointer，當 \`k\` 與 piles 數量變大時，節點數會快速膨脹。

### 動態規劃的一維陣列要怎麼避免重複使用同一疊？
一維動態規劃可以在每一疊建立新的 \`newDp\`，用上一輪 \`dp\` 轉移到下一輪。不要在同一個陣列中由小到大直接更新，否則同一疊的硬幣可能被算進去多次。

### LeetCode 2218 最後應該回傳最大值還是 \`dp[k]\`？
LeetCode 2218 要求剛好取出 \`k\` 枚硬幣，所以最後應該回傳 \`dp[k]\`。若回傳整個陣列中的最大值，可能會拿到少於 \`k\` 枚硬幣的非法狀態。

## 參考資料

- LeetCode：[2218. Maximum Value of K Coins From Piles](https://leetcode.com/problems/maximum-value-of-k-coins-from-piles/)（存取日期：2026-08-28）
- 這篇筆記匯出：\`markdown-export/[LeetCode] Maximum Value of K Coins From Piles.md\`

最後更新：2026-08-28

## 延伸閱讀

- [LeetCode Coin Change：用動態規劃找出最少硬幣組合](/post/leetcode-coin-change)：同樣聚焦 LeetCode、動態規劃，可接著比較不同情境的做法。
- [LeetCode Coin Change 2：動態規劃求硬幣組合數完整解析](/post/leetcode-coin-change-2)：同樣聚焦 LeetCode、動態規劃，可接著比較不同情境的做法。
- [連連看演算法介紹：時間複雜度、圖形資料結構與 BFS/DFS 搜尋](/post/link-game-algorithm-introduction)：同樣聚焦 演算法，可接著比較不同情境的做法。
`;export{e as default};