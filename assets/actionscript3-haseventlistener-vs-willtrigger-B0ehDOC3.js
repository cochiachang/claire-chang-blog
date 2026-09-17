var e=`---
title: "AS3 hasEventListener() 與 willTrigger() 的區別：事件監聽檢查完整解析"
description: "深入解析 ActionScript 3 的 hasEventListener() 與 willTrigger() 差異：hasEventListener() 只檢查物件本身的事件監聽器，willTrigger() 會連父容器一起檢查。附事件流物件階層實例與 trace 結果對照表，幫你快速搞懂 AS3 事件機制。"
date: 2013-08-30
category: 前端開發
tags: [ActionScript3, Event, hasEventListener, willTrigger, dispatchEvent]
readingTime: 3 分鐘
image: /images/tech/hero_actionscript3-haseventlistener-vs-willtrigger.webp
imageAlt: "螢幕上顯示彩色語法突顯的程式碼，代表事件監聽程式開發"
---


# AS3 hasEventListener() 與 willTrigger() 的區別：事件監聽檢查完整解析

承上一篇介紹 Event 事件流的基本概念 [AS3 的事件傳遞機制（Event、dispatchEvent 及 addEventListener）](http://claire-chang.com/1054-as3%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%82%B3%E9%81%9E%E6%A9%9F%E5%88%B6)，這篇再來介紹兩個相關的檢查函數：\`hasEventListener()\` 與 \`willTrigger()\`。看完你會清楚知道：兩者只差在「要不要連父容器一起檢查」。

## hasEventListener() 和 willTrigger() 有什麼不同？

- **\`hasEventListener()\` 方法**：檢查這個 EventDispatcher **物件本身**是否註冊了這個事件的監聽器。
- **\`willTrigger()\` 方法**：檢查這個 EventDispatcher **物件或其父容器**是否註冊了這個事件。

所以兩者的區別是：\`hasEventListener()\` 只檢查它所屬的物件本身；而 \`willTrigger()\` 會檢查物件以及物件的父容器是否有註冊這個事件（不管 capture 的值）。

| 方法 | 檢查範圍 | 是否含父容器 |
| --- | --- | --- |
| \`hasEventListener()\` | 物件本身 | 否 |
| \`willTrigger()\` | 物件 + 整條事件流 | 是 |

## 實例驗證：用物件階層 trace 出差異

假如像下面這樣的物件階層來說：

![物件階層示意圖：stage 底下有 box 等顯示物件](/images/articles/actionscript3-haseventlistener-vs-willtrigger-1.webp)

### 對 stage 註冊事件，box 會回傳什麼？

今天我們對 stage 註冊事件：

\`\`\`actionscript
stage.addEventListener(MouseEvent.CLICK, stageClick);
\`\`\`

則檢查 box 的 \`willTrigger()\` 及 \`hasEventListener()\`：

\`\`\`actionscript
trace(box.willTrigger(MouseEvent.CLICK));
trace(box.hasEventListener(MouseEvent.CLICK));
\`\`\`

結果為：

\`\`\`text
true
false
\`\`\`

因為事件會沿著事件流經過 box，所以 \`willTrigger()\` 回傳 \`true\`；但監聽器並不是註冊在 box 身上，所以 \`hasEventListener()\` 回傳 \`false\`。

### 對 box 註冊事件，box 會回傳什麼？

而若我們對 box 註冊事件：

\`\`\`actionscript
box.addEventListener(MouseEvent.CLICK, stageClick);
\`\`\`

則檢查 box 的 \`willTrigger()\` 及 \`hasEventListener()\`：

\`\`\`actionscript
trace(box.willTrigger(MouseEvent.CLICK));
trace(box.hasEventListener(MouseEvent.CLICK));
\`\`\`

結果為：

\`\`\`text
true
true
\`\`\`

監聽器就註冊在 box 本身，兩個方法都回傳 \`true\`。

### 對 box 註冊事件，stage 會回傳什麼？

同樣對 box 註冊事件，改檢查 stage 的 \`willTrigger()\` 及 \`hasEventListener()\`：

\`\`\`actionscript
trace(stage.willTrigger(MouseEvent.CLICK));
trace(stage.hasEventListener(MouseEvent.CLICK));
\`\`\`

結果為：

\`\`\`text
false
false
\`\`\`

代表 box 不在 stage 完整可能的事件流動線裡。

## 常見問題

### hasEventListener() 和 willTrigger() 最大的差別是什麼？

\`hasEventListener()\` 只檢查該物件本身有沒有註冊這個事件的監聽器；\`willTrigger()\` 則會沿著顯示清單，檢查物件本身及其父容器（整條事件流）有沒有註冊，且不受 capture 參數影響。

### 為什麼對 stage 註冊事件後，box.willTrigger() 是 true 但 hasEventListener() 是 false？

因為事件會在顯示清單中沿著事件流經過 box，\`willTrigger()\` 檢查的是「這個事件會不會觸發到這個物件」，所以回傳 true；但監聽器實際註冊在 stage 身上，\`hasEventListener()\` 只看物件本身，因此回傳 false。

### willTrigger() 會受到 useCapture 參數影響嗎？

不會。\`willTrigger()\` 檢查的是整條事件流上有沒有註冊該事件，不管監聽器是在 capture 階段還是 bubble 階段註冊，都會被檢查到。

### 什麼時候該用 willTrigger()，什麼時候該用 hasEventListener()？

想確認「事件會不會傳遞到這個物件」時用 \`willTrigger()\`，例如除錯事件流問題；想確認「這個物件自己有沒有掛上監聽器」時用 \`hasEventListener()\`，例如避免重複註冊同一個監聽器。

## 參考資料

- [AS3 的事件傳遞機制（Event、dispatchEvent 及 addEventListener）](http://claire-chang.com/1054-as3%E7%9A%84%E4%BA%8B%E4%BB%B6%E5%82%B3%E9%81%9E%E6%A9%9F%E5%88%B6)
- [Adobe 官方文件：EventDispatcher.hasEventListener()](https://help.adobe.com/zh_TW/FlashPlatform/reference/actionscript/3/flash/events/EventDispatcher.html#hasEventListener())
- [Adobe 官方文件：EventDispatcher.willTrigger()](https://help.adobe.com/zh_TW/FlashPlatform/reference/actionscript/3/flash/events/EventDispatcher.html#willTrigger())

## 延伸閱讀

- [hasEventListener()與willTrigger()區別](/post/actionscript3-haseventlistener-vs-willtrigger)：同樣聚焦 Event，可接著比較不同情境的做法。
- [如何在 Flex 4 自製 resize 事件：clipAndEnableScrolling 設定教學](/post/flex4-custom-resize-event)：同樣聚焦 ActionScript3，可接著比較不同情境的做法。
- [Flex 4 Spark Panel 怎麼做成可拖動？自訂 DraggablePanel 完整範例](/post/flex4-spark-draggable-panel)：同樣聚焦 ActionScript3，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2013-08-30，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};