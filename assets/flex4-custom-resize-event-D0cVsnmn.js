var e=`---
title: 如何在 Flex 4 自製 resize 事件：clipAndEnableScrolling 設定教學
description: Flex 4 的 Spark 元件預設會自動裁切超出範圍的內容，導致視窗縮小時偵聽不到 resize 事件。本文說明如何在根元件監聽 resize，並透過 clipAndEnableScrolling="true" 解決事件觸發不了的問題。
date: 2011-08-23
category: 前端開發
tags: [Flex, Flex4, ActionScript3, ResizeEvent, Spark]
readingTime: 2 分鐘
image: /images/tech/hero_flex4-custom-resize-event.webp
imageAlt: 視窗縮放與 Flex 4 resize 事件示意圖
---


# 如何在 Flex 4 自製 resize 事件：clipAndEnableScrolling 設定教學

這篇文章解決一個 Flex 4 常見的困擾：把視窗縮小時，怎麼樣都偵聽不到 resize 事件。關鍵在於 Spark 元件預設會「自動無視」超出範圍的內容，只要在根容器加上 \`clipAndEnableScrolling="true"\`，就能正常偵聽縮小視窗的事件。

## 為什麼 Flex 4 縮小視窗時偵聽不到 resize 事件？

首先，resize 事件是針對「該元件大小被縮放」時才會產生，所以要監聽 resize，應該在根元件（root container）上註冊事件偵聽：

\`\`\`actionscript
<?xml version="1.0" encoding="utf-8"?>
<s:Application xmlns:fx="http://ns.adobe.com/mxml/2009"
               xmlns:s="library://ns.adobe.com/flex/spark"
               resize="application1_resizeHandler(event)">
    <fx:Script>
        <![CDATA[
            import mx.events.ResizeEvent;

            protected function application1_resizeHandler(event:ResizeEvent):void
            {
                trace("width: " + width + ", height: " + height);
            }
        ]]>
    </fx:Script>
</s:Application>
\`\`\`

問題出在 Flex 4 的 Spark 元件有個預設行為：**自動無視超出範圍大小的東西**。因此當我們把視窗縮小時，超出的大小被直接無視，元件根本不認為自己被縮放，自然就偵聽不到 resize 事件。

## 如何用 clipAndEnableScrolling 解決？

\`clipAndEnableScrolling\` 這個屬性主要是告訴容器「要不要自動無視超出的範圍」：

| 屬性值 | 行為 |
| --- | --- |
| \`false\`（Group 預設值） | 自動無視超出範圍的內容，縮小視窗時不觸發 resize |
| \`true\` | 裁切並啟用捲動，超出範圍會被視為實際變化，可以偵聽到 resize |

因為 \`Group\` 的預設值是 \`false\`（也就是無視超出範圍），我們要先把 \`clipAndEnableScrolling\` 設定為 \`true\`，之後縮小視窗時 resize 事件才會正常觸發：

\`\`\`actionscript
<s:Group clipAndEnableScrolling="true">
    <!-- 內容 -->
</s:Group>
\`\`\`

## 常見問題

### 為什麼我的 Flex 4 應用程式縮小視窗時收不到 resize 事件？

因為 Spark 元件（例如 Group）預設 \`clipAndEnableScrolling="false"\`，會自動無視超出範圍的內容，視窗縮小時元件不認為自己被縮放。把根容器的這個屬性設為 \`true\` 即可解決。

### resize 事件應該註冊在哪個元件上？

resize 事件是針對該元件本身大小被縮放時產生的，所以要在根元件（例如 \`s:Application\`）上註冊偵聽，而不是在內部的子元件上。

### clipAndEnableScrolling 的預設值是什麼？

在 Flex 4 的 \`Group\` 容器中預設值是 \`false\`，代表超出範圍的內容會被自動無視。將它設為 \`true\` 後，容器會裁切內容並啟用捲動，resize 事件也能正常觸發。

## 參考資料
- Adobe Flex 4 文件：Group.clipAndEnableScrolling 屬性說明

## 延伸閱讀

- [Flex 4 Spark Panel 怎麼做成可拖動？自訂 DraggablePanel 完整範例](/post/flex4-spark-draggable-panel)：同樣聚焦 Flex4、Spark，可接著比較不同情境的做法。
- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 Flex，可接著比較不同情境的做法。
- [Flex 圖片不等比縮放設定：Flex3 與 Flex4 的正確寫法](/post/flex-image-non-uniform-scaling)：同樣聚焦 Flex、Flex4，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-08-23，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};