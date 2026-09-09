var e=`---
title: LeetCode Coin Change：用動態規劃找出最少硬幣組合
description: "以 JavaScript 實作 LeetCode 322 Coin Change 最少硬幣數動態規劃解法，說明如何用 DP 陣列由小金額逐項推導到目標金額，記錄從 32.59% 效能優化到 72.28% 的過程與思路轉換，適合想入門動態規劃與演算法刷題的讀者。"
date: 2022-10-05
category: 後端開發
tags: [LeetCode, 動態規劃, JavaScript, 演算法]
readingTime: 5 分鐘
image: /images/tech/hero_leetcode-coin-change.webp
imageAlt: LeetCode Coin Change 動態規劃題目的筆記示意圖
---


# LeetCode Coin Change：用動態規劃找出最少硬幣組合

這篇文章解決的問題是：給定一組硬幣面額與目標金額，如何用最少的硬幣數湊出目標金額？我以 LeetCode 322（Coin Change）為例，用 JavaScript 示範動態規劃（Dynamic Programming）的解法，並記錄從 32.59% 效能一路優化到 72.28% 的過程。

題目連結：[LeetCode — Coin Change](https://leetcode.com/problems/coin-change)

最近開始刷 LeetCode，覺得思考這些邏輯問題還滿好玩的，第一個刷的就是這題，它是一個動態規劃的題目。

## 為什麼直覺思考會行不通？

一般我們在思考的時候會以錢幣為基準，例如 1、3、5 的錢幣要怎麼湊成 11 元，我們會拿 1、3、5 去隨機湊硬幣。但是當數值大了以後，要計算最小的錢幣組合就會變得很困難。

## 怎麼把問題轉成動態規劃？

像這種極限求值就需要把思考轉換過來：我們可以一步步拆解，先了解 1、3、5 若要組成 1 要用幾個（1 個 1），組成 2 要用幾個（2 個 1），組成 3 要用幾個。

到 3 的時候就會發現，3 可以用「3 個 1」或「1 個 3」組成，這時候就可以比較誰用的硬幣比較少，然後把最小值 1 存到「可組成結果為 3」的陣列。

接下來思考 4 的時候，我們可以看 4 減掉硬幣 1，也就是 3 的最小使用硬幣數量，那就代表用 3 再加上硬幣 1 可以組成 4。再算組成 6 要幾個硬幣：6 減掉硬幣 3，可以拿到硬幣 3 要用幾個硬幣，所以就是硬幣 3 使用的硬幣數量 + 1。

## JavaScript 解法長什麼樣？

\`\`\`javascript
var coinChange = function (coins, amount) {
    if (amount == 0) return 0;
    let amountRecord = [];
    amountRecord[0] = 0;
    lastExistResult = 0;
    minCoin = Math.min(...coins);
    //紀錄這些硬幣能夠組合成的數值所使用的硬幣數, 並用這些數值來推算目標所需的硬幣
    for (var currentAmount = 1; currentAmount <= amount; currentAmount++) {
        amountRecord[currentAmount] = Infinity;
        if (currentAmount + minCoin >= lastExistResult) {
            for (var coin of coins) {
                if (coin <= currentAmount) {
                    //尋找這一個數字可不可以用之前可組成的硬幣加上其中一個新的硬幣來滿足(以確認是最小的硬幣數目)
                    amountRecord[currentAmount] = Math.min(amountRecord[currentAmount], amountRecord[currentAmount - coin] + 1);
                }
            }
        }
        if (amountRecord[currentAmount] != Infinity) {
            lastExistResult = amountRecord[currentAmount];
        }
    }
    return amountRecord[amount] == Infinity ? -1 : amountRecord[amount];
};
\`\`\`

## 效能不滿意該怎麼優化？

這個 JS 的效能只贏了 32.59% 的人，覺得不太開心（?），所以我做了幾件事：

- 把 \`console.log\` 拿掉
- 把 \`let amountRecord = []; amountRecord[0] = 0;\` 改成一行 \`let amountRecord = [0]\`（是有沒有這麼無聊）

接著我突發奇想：若這個數字可用硬幣湊齊，下一個數字如果小於最小的 coins 數字的話，可以省略。例如硬幣是 10、15、18，但要組成 11，很明顯就不可能有結果，因為 11 - 10 小於 10。

PS：測試後其實拿掉 \`console.log\` 影響最大 XD

\`\`\`javascript
var coinChange = function (coins, amount) {
    if (amount == 0) return 0;
    let amountRecord = [0];
    lastExistResult = 0;
    minCoin = Math.min(...coins);
    //紀錄這些硬幣能夠組合成的數值所使用的硬幣數, 並用這些數值來推算目標所需的硬幣
    for (var currentAmount = 1; currentAmount <= amount; currentAmount++) {
        amountRecord[currentAmount] = Infinity;
        if (currentAmount + minCoin >= lastExistResult) {
            for (var coin of coins) {
                if (coin <= currentAmount) {
                    amountRecord[currentAmount] = Math.min(amountRecord[currentAmount], amountRecord[currentAmount - coin] + 1);
                }
            }
            if (amountRecord[currentAmount] != Infinity) {
                lastExistResult = amountRecord[currentAmount];
            }
        }
    }
    return amountRecord[amount] == Infinity ? -1 : amountRecord[amount];
};
\`\`\`

結果至少擊敗了 72.28% 的人，累了...先這樣吧 XDD

## 常見問題

### Coin Change 的時間複雜度是多少？

以 DP 解法來說，外層迴圈跑過每個金額（amount），內層跑過每種硬幣（coins），所以時間複雜度是 O(amount × coins.length)，空間複雜度是 O(amount)。

### 為什麼用 Infinity 初始化 DP 陣列？

因為一開始還不知道每個金額可不可以被湊出來，用 Infinity 代表「尚未有解」，之後透過 \`Math.min\` 比較時只要找到任一種組合就會被覆蓋成較小的硬幣數。

### 無法湊出目標金額時要回傳什麼？

LeetCode 這題要求回傳 -1。實作上就是檢查 \`amountRecord[amount]\` 是否仍為 Infinity，是的話就回傳 -1。

### 為什麼拿掉 console.log 對效能影響最大？

\`console.log\` 每次呼叫都要序列化並輸出資料到瀏覽器開發者工具，在迴圈內重複執行時開銷非常大，這比初始化寫法的微調影響更多。

## 參考資料

- [LeetCode — Coin Change 題目頁](https://leetcode.com/problems/coin-change)

## 延伸閱讀

- [LeetCode Coin Change 2：動態規劃求硬幣組合數完整解析](/post/leetcode-coin-change-2)：同樣聚焦 LeetCode、動態規劃，可接著比較不同情境的做法。
- [LeetCode 2218 Maximum Value of K Coins From Piles 解題筆記](/post/leetcode-maximum-value-k-coins-from-piles)：同樣聚焦 LeetCode、JavaScript，可接著比較不同情境的做法。
- [連連看演算法介紹：時間複雜度、圖形資料結構與 BFS/DFS 搜尋](/post/link-game-algorithm-introduction)：同樣聚焦 演算法，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2022-10-05，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};