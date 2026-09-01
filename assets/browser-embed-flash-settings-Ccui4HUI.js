var e=`---
title: "在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 JavaScript 存取"
description: "整理在瀏覽器內插入 Flash（SWF）時最常用的三種 object/embed 設定：wmode transparent 讓 Flash 顯示透明、allowFullScreen 允許全螢幕、allowScriptAccess 允許 Flash 存取網頁內的 JavaScript，附完整 HTML 範例程式碼。"
date: 2009-04-02
category: 前端開發
tags: [Flash, ActionScript, HTML, 前端開發]
readingTime: 2 分鐘
image: /images/tech/hero_browser-embed-flash-settings.webp
imageAlt: "瀏覽器視窗與網頁嵌入設定的示意圖"
---


# 在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 JavaScript 存取

這篇文章整理我在網頁內插入 Flash（SWF）時最常調整的三種 \`object\` / \`embed\` 設定：讓 Flash 顯示透明（\`wmode\`）、允許全螢幕（\`allowFullScreen\`）、以及允許 Flash 存取網頁內的 JavaScript（\`allowScriptAccess\`）。每種設定都附上可直接複製的完整 HTML 範例。

## 如何讓 Flash 顯示透明（並被其他 div 蓋住）？

關鍵是 \`wmode\` 參數設為 \`transparent\`。這項設定也可以讓 Flash 被壓在某些 div 之下，解決 Flash 圖層永遠浮在最上層的問題。

\`\`\`html
<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="770" height="148">
  <param name="movie" value="swf/top.swf" />
  <param name="quality" value="high" />
  <param name="wmode" value="transparent" />
</object>
\`\`\`

注意 \`wmode="transparent"\` 要同時寫在 \`<param>\` 與 \`<embed>\` 兩處，否則只有部分瀏覽器會生效。

## 如何讓 Flash 允許全螢幕？

加上 \`allowFullScreen\` 參數並設為 \`true\`，SWF 內部就能呼叫全螢幕 API：

\`\`\`html
<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="780" height="560" align="middle">
  <param name="allowFullScreen" value="true" />
  <param name="movie" value="swf/top.swf" />
  <param name="quality" value="high" />
</object>
\`\`\`

## 如何允許 Flash 存取網頁內的 JavaScript？

用 \`allowScriptAccess\` 參數控制。設成 \`sameDomain\` 表示只允許同一個網域的腳本互動，兼顧功能與安全性：

\`\`\`html
<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="780" height="560" align="middle">
  <param name="allowScriptAccess" value="sameDomain" />
  <param name="movie" value="swf/top.swf" />
  <param name="quality" value="high" />
</object>
\`\`\`

## 三種設定快速對照

| 目的 | 參數 | 建議值 |
| --- | --- | --- |
| 透明背景、可被 div 蓋住 | \`wmode\` | \`transparent\` |
| 允許 SWF 進入全螢幕 | \`allowFullScreen\` | \`true\` |
| 允許 Flash 呼叫頁面 JavaScript | \`allowScriptAccess\` | \`sameDomain\` |

## 常見問題

### 為什麼下拉選單或 div 會被 Flash 蓋住？

因為 Flash 預設的 \`wmode\` 是 \`window\`，會浮在所有 HTML 元素之上。把 \`wmode\` 設為 \`transparent\`（或 \`opaque\`）讓 Flash 進入瀏覽器的一般合成流程，div 就能正常疊在它上面。

### \`wmode="transparent"\` 要寫在哪些地方？

必須同時寫在 \`<object>\` 內的 \`<param name="wmode" value="transparent" />\` 與 \`<embed>\` 標籤的 \`wmode="transparent"\` 屬性上。只寫其中一邊時，IE 與使用 NPAPI 外掛的瀏覽器行為會不一致。

### \`allowScriptAccess\` 可以設成 \`always\` 嗎？

可以，\`always\` 允許跨網域的腳本互動，但會擴大攻擊面。若 SWF 與頁面在同一個網域，建議維持 \`sameDomain\`，只在確有跨網域需求時才放寬。

### 現代瀏覽器還能播放 Flash 嗎？

不行。Flash 已於 2020 年底終止支援，現代瀏覽器移除了 Flash 外掛。新專案應改用 HTML5、Canvas 或 WebGL（例如 PixiJS），這些舊設定僅適用於維護歷史專案或本機模擬環境。

## 參考資料

## 延伸閱讀

- [在瀏覽器內插入 Flash 的幾種設定：透明、全螢幕與 Script 存取](/post/insert-flash-in-browser-settings)：同樣聚焦 Flash、ActionScript，可接著比較不同情境的做法。
- [Stage3D 運作原理：Flash 如何用 GPU 完成 3D 渲染？](/post/stage3d-rendering-principles)：同樣聚焦 ActionScript、Flash，可接著比較不同情境的做法。
- [Flash 內使用點陣圖（BitmapData）與背景著色函數](/post/flash-bitmapdata-background-fill)：同樣聚焦 ActionScript、Flash，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2009-04-02，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};