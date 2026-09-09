var e=`---
title: Flash 內使用點陣圖（BitmapData）與背景著色函數
description: 在 Flash ActionScript 2.0 中使用 flash.display.BitmapData 載入點陣圖，用 attachBitmap 顯示，並以 beginBitmapFill 撰寫可將元件背景填滿點陣圖的著色函數，類似網頁 background 的效果。
date: 2011-12-01
category: 前端開發
tags: [ActionScript, Flash, BitmapData, AS2]
readingTime: 3 分鐘
image: /images/tech/hero_flash-bitmapdata-background-fill.webp
imageAlt: 以點陣圖材質填滿背景的 Flash 向量繪圖示意
---


# Flash 內使用點陣圖（BitmapData）與背景著色函數

在 Flash 的 ActionScript 2.0 裡要使用點陣圖，需要 import \`flash.display.BitmapData\` 這個類別。這篇筆記整理載入點陣圖的語法、\`attachBitmap\` 的參數意義，並附上一個我自己撰寫的背景著色函數，可以把元件的背景填滿指定點陣圖，效果類似網頁的 \`background\`。

## 如何在 Flash 中載入點陣圖？

在時間軸或類別中先 import \`flash.display.BitmapData\`，接著用 \`BitmapData.loadBitmap\` 從元件庫載入點陣圖，再用 \`attachBitmap\` 掛到空的 MovieClip 上：

\`\`\`actionscript
_mc = this.createEmptyMovieClip("bm_mc", 100);
_bitmap = BitmapData.loadBitmap("photo");
_mc.attachBitmap(_bitmap, 10, "always", false);
\`\`\`

其中 \`photo\` 是你的點陣圖在元件庫內的連結識別子名稱（在元件庫對該點陣圖設定 Linkage Identifier）。

## attachBitmap 的參數是什麼意思？

\`attachBitmap\` 的語法為：

\`\`\`
attachBitmap(Bitmap物件, 深度, 點像素頡取, 柔化)
\`\`\`

- 第 1 個參數：要掛上的 BitmapData 物件
- 第 2 個參數：深度（depth）
- 第 3 個參數：點像素頡取（smoothing/pixel snapping 設定，例如 \`"always"\`）
- 第 4 個參數：是否柔化（smoothing）

## 背景著色函數：用點陣圖填滿元件背景

下面的函數是我自己撰寫的背景著色函數，可將一個元件的背景填滿該點陣圖，類似網頁的 background 效果。若你希望點陣圖著色的範圍與該元件長寬相同，可在傳值時直接傳入 \`元件名._height\`、\`元件名._width\`。附註一提，此函數適用於 ActionScript 2.0：

\`\`\`actionscript
//背景著色函數(元件、寬、高、圖片識別子名)
function fillColor(tmpObj:MovieClip, bmpW:Number,
bmpH:Number, loadBitName:String)
{
	with (tmpObj)
	{
		var bg_bitmap = BitmapData.loadBitmap(loadBitName);
		beginBitmapFill(bg_bitmap,null,true,false);
		moveTo(0,0);
		lineTo(0,bmpH);
		lineTo(bmpW,bmpH);
		lineTo(bmpW,0);
		lineTo(0,0);
		endFill();
	}
}
\`\`\`

這個函數的輸入值為「元件名」、「要著色的寬度」、「要著色的高度」、「要當背景的點陣圖識別子名稱」。核心做法是用 \`beginBitmapFill\` 以點陣圖作為填色來源，再以 \`moveTo\`／\`lineTo\` 畫出目標範圍的矩形路徑後 \`endFill()\`，點陣圖就會像網頁背景圖一樣平鋪填滿。若此函數有任何問題或 BUG 歡迎反應給我。

## 常見問題

### Flash 裡要怎麼從元件庫載入點陣圖？

先 import \`flash.display.BitmapData\`，在元件庫為點陣圖設定連結識別子，再用 \`BitmapData.loadBitmap("識別子名稱")\` 取得 BitmapData 物件，最後以 \`attachBitmap\` 掛到空的 MovieClip 上顯示。

### beginBitmapFill 的作用是什麼？

\`beginBitmapFill\` 讓後續繪製的向量路徑以指定點陣圖作為填色來源，點陣圖會平鋪在路徑範圍內。搭配 \`moveTo\`／\`lineTo\` 畫出矩形後呼叫 \`endFill()\`，就能做出類似網頁 background-image 的平鋪背景效果。

### 這個背景著色函數適用哪些版本的 ActionScript？

這個函數是針對 ActionScript 2.0 撰寫的，使用 AS2 的 MovieClip 繪圖 API 與 \`BitmapData.loadBitmap\`。若在 AS3 專案中，載入點陣圖與顯示的方式不同，需要改用 \`Loader\` 或 \`Bitmap\` 類別的做法。

### 著色範圍要怎麼跟元件大小一致？

呼叫 \`fillColor\` 時把寬高參數直接傳入 \`元件名._width\` 與 \`元件名._height\`，函數就會以該元件的實際長寬畫出填色範圍，讓點陣圖剛好鋪滿整個元件背景。

## 參考資料

- Adobe 官方文件：flash.display.BitmapData（ActionScript 2.0 Language Reference）

## 延伸閱讀

- [Flash 內使用點陣圖：BitmapData 載入與背景著色完整教學](/post/flash-bitmapdata-usage)：同樣聚焦 ActionScript、Flash，可接著比較不同情境的做法。
- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取](/post/insert-flash-in-browser-settings)：同樣聚焦 Flash、ActionScript，可接著比較不同情境的做法。
- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 JavaScript 存取](/post/browser-embed-flash-settings)：同樣聚焦 Flash、ActionScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-12-01，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};