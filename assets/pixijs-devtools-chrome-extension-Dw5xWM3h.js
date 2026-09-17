var e=`---
title: PixiJS devtools：用 Chrome 擴充功能除錯 Canvas 遊戲場景與屬性
description: PixiJS 的繪圖元件都畫在 Canvas 裡，用一般 Chrome 開發者工具看不到 DOM，除錯相對困難。我介紹 PixiJS devtools 這個 Chrome 擴充功能：安裝後可檢視場景上的元件樹與屬性、框選元件位置、動態調整 x、y、visible 等數值，讓網頁遊戲的對位與除錯所見即所得。
date: 2018-11-12
category: 前端開發
tags: [PixiJS, Chrome DevTools, Canvas, 網頁遊戲, 前端除錯]
readingTime: 4 分鐘
image: /images/tech/hero_pixijs-devtools-chrome-extension.webp
imageAlt: 深色螢幕上顯示彩色語法高亮的 JavaScript 程式碼
---


# PixiJS devtools：用 Chrome 擴充功能除錯 Canvas 遊戲場景與屬性

PixiJS 把所有繪圖元件都畫在 Canvas 裡，一般的 Chrome 開發者工具看不到這些元件，除錯與對位變得相對麻煩。這篇文章介紹 PixiJS devtools 這個 Chrome 擴充功能：安裝後可以在開發者工具裡檢視場景元件樹、框選元件位置，並動態調整 \`x\`、\`y\`、\`visible\` 等屬性，讓除錯所見即所得。

## 為什麼 PixiJS 遊戲需要專屬的除錯工具？

Chrome 開發者工具是網頁開發者常在使用的偵錯工具，可以檢查下載的檔案、HTML 的 DOM 元素檢視及編輯、調整 CSS 等。

開發工具打開方式：

1. 功能表 -> 工具 -> 開發人員工具
2. 直接按 F12 叫出來
3. 在網頁任何位置按右鍵，選擇「檢查元素」，就可以看到原始碼。

工具有許多的面版在最上列，左邊也可以直接選擇要找的 HTML 元素的位置：

![Chrome 開發者工具的偵錯面板](/images/articles/pixijs-devtools-chrome-extension-1.webp)

上圖即為偵錯面板的圖示。關於這個工具更多的資訊，可以參考[Chrome 開發者工具官方文件](https://developers.google.com/web/tools/chrome-devtools/?hl=zh-tw)。

一般的 debug tools 在一般網頁上十分夠用，但對 PixiJS 來說，因為繪圖元件都放在 Canvas 裡，DOM 面板完全看不到場景結構，對於畫面上的偵錯較不容易。因此我推薦安裝 PixiJS devtools 這個擴充應用程式。

## 如何安裝 PixiJS devtools？

到 Chrome 線上應用程式商店搜尋 PixiJS devtools，直接安裝即可：

![Chrome 線上應用程式商店裡的 PixiJS devtools 擴充功能](/images/articles/pixijs-devtools-chrome-extension-2.webp)

安裝完成後，如果這個網頁的頁面內有使用 Pixi，開發者工具就會多顯示一個 Pixi 的 tab：

![開發者工具出現 Pixi 分頁](/images/articles/pixijs-devtools-chrome-extension-3.webp)

## PixiJS devtools 可以做什麼？

### 檢視場景元件樹

在左邊我們可以看到場景上所有的繪圖元件以及其屬性：

![PixiJS devtools 顯示場景上所有繪圖元件](/images/articles/pixijs-devtools-chrome-extension-4.webp)

### 框選元件位置

當我們點選元件的名稱時，場景上會有框框將這個元件的位置框出來：

![點選元件後場景上會框出該元件的位置](/images/articles/pixijs-devtools-chrome-extension-5.webp)

當我們有物件放到場景上卻沒有看到時，用這個功能可以很方便地查找：該物件是確實存在場景上、只是被其他物件壓住，還是根本沒有加進場景裡。也可以從物件的順序看到圖層的相對關係——列表中越下面的代表越上面的圖片。

面版左上方的 Reconnect 按鈕則是用來刷新元件資訊；元件列表的更新需要手動按這個鈕，才能夠更新到最新狀態。

## 屬性面版如何幫助對位與除錯？

屬性面版的部份是我認為最好用的功能。我們可以直接檢視現在這個物件的某些屬性是否正確，例如 \`x\`、\`y\`、\`visible\`，並且可以動態調整：

![PixiJS devtools 的屬性面版可以動態調整物件屬性](/images/articles/pixijs-devtools-chrome-extension-6.webp)

因為目前 PixiJS 還沒有專屬的 IDE，開發遊戲時的對位相對麻煩。這個工具因為可以所見即所得，動態調整 \`x\`、\`y\` 時可以直接在畫面上反應出來，在對位上是十分方便的工具。

調整數值時的小技巧：直接用上、下方向鍵來增加或減少數字，就可以在畫面上馬上看到物件的移動；若是直接輸入數字，游標比較容易有跳掉的狀況。

| 功能 | 用途 |
|---|---|
| 元件樹列表 | 檢視場景上所有繪圖元件與圖層順序（越下面越上層） |
| 點選元件名稱 | 在場景上框出該元件位置，查找「看不到的物件」 |
| Reconnect 按鈕 | 手動刷新元件列表資訊 |
| 屬性面版 | 檢視並動態調整 \`x\`、\`y\`、\`visible\` 等屬性 |
| 上/下方向鍵 | 微調數值並即時看到物件移動 |

## 常見問題

### PixiJS devtools 是什麼？

它是一個 Chrome 擴充功能，會在開發者工具裡新增一個 Pixi 分頁，用來檢視 PixiJS 場景上的元件樹與屬性，彌補一般 DevTools 看不到 Canvas 內部結構的問題。

### 為什麼 Chrome 開發者工具看不到 PixiJS 的元件？

因為 PixiJS 把所有繪圖元件都渲染在 \`<canvas>\` 元素裡，DOM 面板只能看到一個 canvas 標籤，看不到場景結構，所以需要專屬的擴充工具來檢視。

### 安裝後為什麼沒有出現 Pixi 分頁？

這個擴充功能只會在頁面偵測到有使用 Pixi 時才顯示分頁。請確認該網頁確實有載入 PixiJS，並重新打開開發者工具試試。

### 元件列表沒有顯示最新的內容怎麼辦？

元件列表不會自動更新，需要按面版左上方的 Reconnect 按鈕手動刷新，才能看到最新的元件資訊。

### 要怎麼快速對位場景上的物件？

在屬性面版中用上、下方向鍵微調 \`x\`、\`y\` 數值，物件會即時在畫面上移動，比直接輸入數字方便（直接輸入時游標容易跳掉）。

## 參考資料

- [Chrome 線上應用程式商店 — PixiJS devtools](https://chrome.google.com/webstore/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon)
- [Chrome 開發者工具官方文件](https://developers.google.com/web/tools/chrome-devtools/?hl=zh-tw)
- [好用的 Chrome 內建開發人員工具](http://mark528.pixnet.net/blog/post/33445174-%E5%A5%BD%E7%94%A8%E7%9A%84-chrome-%E5%85%A7%E5%BB%BA%E9%96%8B%E7%99%BC%E4%BA%BA%E5%93%A1%E5%B7%A5%E5%85%B7)

## 延伸閱讀

- [Pixi.js 網頁遊戲開發實戰：從介紹到連連看遊戲的完整開發流程](/post/pixijs-web-game-development-practice)：同樣聚焦 PixiJS、網頁遊戲，可接著比較不同情境的做法。
- [用Chrome將本地端檔案替代伺服器檔案](/post/chrome-local-file-override)：同樣聚焦 Chrome DevTools、前端除錯，可接著比較不同情境的做法。
- [PixiJS 介紹：2D WebGL 遊戲引擎適合做什麼？](/post/pixijs-introduction-2d-webgl-game-engine)：同樣聚焦 PixiJS，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2018-11-12，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};