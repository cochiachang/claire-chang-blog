var e=`---
title: Flash 內使用點陣圖：BitmapData 載入與背景著色完整教學
description: 在 Flash（ActionScript 2.0）內使用點陣圖，需要 import flash.display.BitmapData 類別。本文說明如何用 BitmapData.loadBitmap 載入元件庫中的點陣圖、attachBitmap 的參數意義，並分享我自己撰寫的背景著色函數，可像網頁 background 一樣把元件背景填滿點陣圖。
date: 2011-12-01
category: 前端開發
tags: [ActionScript, Flash, BitmapData, 點陣圖]
readingTime: 2 分鐘
image: /images/tech/hero_flash-bitmapdata-usage.webp
imageAlt: Flash ActionScript BitmapData 點陣圖處理示意圖
---


# Flash 內使用點陣圖：BitmapData 載入與背景著色完整教學

在 Flash 內使用點陣圖，需要 import \`flash.display.BitmapData\` 這個類別。本文整理載入點陣圖的基本語法、\`attachBitmap\` 各參數的意義，並附上我自己撰寫的背景著色函數，可以把元件背景填滿點陣圖，效果類似網頁的 background。

## 在 Flash 內要怎麼載入點陣圖？

在 flash 內使用點陣圖，需要 import \`flash.display.BitmapData\` 這個類別，載入點陣圖的語法為：

\`\`\`actionscript
_mc = this.createEmptyMovieClip("bm_mc", 100);
_bitmap = BitmapData.loadBitmap("photo");
_mc.attachBitmap(_bitmap, 10, "always", false);
\`\`\`

其中 \`photo\` 為你的點陣圖在元件庫內的連結識別子名稱（ linkage identifier ）。

## attachBitmap 的參數各代表什麼意思？

\`attachBitmap\` 的語法為：

\`\`\`
attachBitmap(Bitmap物件, 深度, 點像素頡取, 柔化)
\`\`\`

四個參數依序是：要附加的 Bitmap 物件、顯示深度、點像素頡取方式（例如 \`"always"\`）、以及是否柔化（ smoothing ）。實務上想讓點陣圖在縮放時保持清晰或柔和平滑，就是透過後兩個參數控制。

## 如何把元件背景填滿點陣圖，像網頁的 background 一樣？

下面的函數是由我所撰寫的背景著色函數，可將一個元件的背景填滿該點陣圖，類似網頁的 background。若您希望點陣圖著色的範圍與該元件長寬相同，可在傳值時直接傳入 \`"元件名._height"\`、\`"元件名._width"\`。附註一提，此函數適用於 as2.0。

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

這個函數的輸入值為「元件名」、「要著色的寬度」、「要著色的高度」、「要當背景的識別子名稱」。函數內部先用 \`BitmapData.loadBitmap\` 取得點陣圖，再以 \`beginBitmapFill\` 搭配 \`moveTo\`/\`lineTo\` 畫出填滿範圍，最後 \`endFill()\` 收尾，即可把指定範圍鋪滿點陣圖。

若此函數有任何問題或 BUG 歡迎反應給我。

## 常見問題

### 為什麼 BitmapData.loadBitmap 找不到我的圖片？

點陣圖必須先放進元件庫，並在「屬性 → 連結」設定匯出給 ActionScript，\`loadBitmap("photo")\` 中的字串要對應該連結識別子名稱，大小寫需完全一致。

### attachBitmap 的第四個參數 false 代表什麼？

第四個參數是 smoothing（柔化），設為 false 代表點陣圖縮放時不做平滑處理，放大後會出現鋸齒；若需要平滑縮放可改為 true。

### 這個背景著色函數可以用在 ActionScript 3.0 嗎？

不行，此函數是以 as2.0 的 MovieClip 繪圖 API 與 with 語法撰寫的，僅適用於 ActionScript 2.0；AS3 需改用 Graphics 的 beginBitmapFill 另行實作。

## 延伸閱讀

- [Flash 內使用點陣圖（BitmapData）與背景著色函數](/post/flash-bitmapdata-background-fill)：同樣聚焦 ActionScript、Flash，可接著比較不同情境的做法。
- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取](/post/insert-flash-in-browser-settings)：同樣聚焦 Flash、ActionScript，可接著比較不同情境的做法。
- [Flash 時間軸運作注意點：遮罩、關鍵影格與效能優化筆記](/post/flash-timeline-notes)：同樣聚焦 Flash、ActionScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-12-01，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};