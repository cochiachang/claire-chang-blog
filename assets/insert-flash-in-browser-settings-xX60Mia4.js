var e=`---
title: 在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取
description: 在瀏覽器內嵌入 Flash 的常用設定筆記：用 wmode transparent 讓 Flash 透明、allowFullScreen 開啟全螢幕、allowScriptAccess 控制 JavaScript 存取，附完整 HTML object 與 embed 範例程式碼。
date: 2009-04-02
category: 前端開發
tags: [Flash, ActionScript, HTML, JavaScript, 前端開發]
readingTime: 2 分鐘
image: /images/tech/hero_insert-flash-in-browser-settings.webp
imageAlt: 螢幕上顯示的網頁標記語言程式碼，象徵在瀏覽器內嵌入 Flash 的 HTML 設定
---


# 在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取

在網頁裡嵌入 Flash 時，最常碰到的三個需求就是：讓 Flash 背景透明、允許全螢幕播放、以及讓 Flash 能存取網頁裡的 JavaScript。這篇整理我常用的三種 \`<object>\`／\`<embed>\` 設定寫法，直接貼上改路徑就能用。

## 怎麼讓 Flash 顯示透明，還能被 div 壓在下面？

關鍵是 \`wmode\` 這個參數，把它設成 \`transparent\`，Flash 的背景就會變透明。這項設定還有一個附帶效果：可以讓 Flash 被壓在某些 \`div\` 圖層之下，做下拉選單覆蓋 Flash 橫幅時特別好用。

\`\`\`HTML
<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="770" height="148">
<param name="movie" value="swf/top.swf" />
<param name="quality" value="high" />
<param name="wmode" value="transparent" />
<embed src="swf/top.swf" wmode="transparent" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="770" height="148"></embed>
</object>
\`\`\`

記得 \`<param name="wmode">\` 和 \`<embed>\` 上的 \`wmode\` 屬性兩邊都要設，只設其中一邊在不同瀏覽器上會失效。

## 怎麼讓 Flash 允許全螢幕播放？

要讓 Flash 內容可以切換全螢幕，必須在嵌入語法加上 \`allowFullScreen\` 並設為 \`true\`，Flash 影片內部再用 ActionScript 呼叫全螢幕 API 才會生效：

\`\`\`HTML
<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="780" height="560" align="middle">
<param name="allowFullScreen" value="true" />
<param name="movie" value="swf/top.swf" />
<param name="quality" value="high" />
<embed src="swf/top.swf" quality="high" bgcolor="#ffffff" width="780" height="560" align="middle" allowScriptAccess="sameDomain" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />
</object>
\`\`\`

## 怎麼允許 Flash 存取網頁內的 JavaScript？

Flash 與網頁之間要用 \`ExternalInterface\` 溝通時，嵌入語法必須開放 \`allowScriptAccess\`。設成 \`sameDomain\` 表示只允許同一個網域的腳本互動，是最常用的安全設定：

\`\`\`HTML
<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="780" height="560" align="middle">
<param name="allowScriptAccess" value="sameDomain" />
<param name="movie" value="swf/top.swf" />
<param name="quality" value="high" />
<embed src="swf/top.swf" quality="high" bgcolor="#ffffff" width="780" height="560" align="middle" allowScriptAccess="sameDomain" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />
</object>
\`\`\`

## 常見問題

### wmode 設了 transparent 卻還是有白色背景？

\`<param name="wmode" value="transparent" />\` 和 \`<embed>\` 標籤上的 \`wmode="transparent"\` 屬性必須同時存在，因為 IE 走 \`<object>\`、其他瀏覽器走 \`<embed>\`，漏掉其中一邊就會在對應瀏覽器上失效。

### allowScriptAccess 的 sameDomain 和 always 有什麼差別？

\`sameDomain\` 只允許與 Flash 檔同網域的腳本互動，\`always\` 則不分網域全部放開。基於安全考量，一般情況用 \`sameDomain\` 就夠了，除非確定需要跨網域溝通。

### 現在瀏覽器還支援這些 Flash 設定嗎？

Flash 已於 2020 年底終止支援，現代瀏覽器不再播放 SWF。這篇保留作為維護舊專案或研究歷史技術時的參考，新專案請改用 HTML5 Canvas、WebGL 或影片等替代方案。

## 延伸閱讀

- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 JavaScript 存取](/post/browser-embed-flash-settings)：同樣聚焦 Flash、ActionScript，可接著比較不同情境的做法。
- [Stage3D 運作原理：Flash 如何用 GPU 完成 3D 渲染？](/post/stage3d-rendering-principles)：同樣聚焦 ActionScript、Flash，可接著比較不同情境的做法。
- [Flash 內使用點陣圖（BitmapData）與背景著色函數](/post/flash-bitmapdata-background-fill)：同樣聚焦 ActionScript、Flash，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2009-04-02，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};