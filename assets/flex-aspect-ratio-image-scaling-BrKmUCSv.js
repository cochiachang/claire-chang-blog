var e=`---
title: "Flex如何讓圖片不等比縮放？"
description: "Flex中讓圖片不等比縮放的設定筆記：Flex3用scaleContent與maintainAspectRatio兩個屬性，Flex4改用scaleMode=\\"stretch\\"，一文搞懂兩代的差異與寫法。"
date: 2011-11-29
category: 前端開發
tags: [Flex3, Flex4, ActionScript, 圖片處理]
readingTime: 3 分鐘
image: /images/tech/hero_flex-aspect-ratio-image-scaling.webp
imageAlt: 彩色漸層波浪影像被平滑延展變形，象徵圖片不等比縮放的拉伸效果
---


# Flex如何讓圖片不等比縮放？

在Flex裡預設情況下，圖片放進容器縮放時會維持原本的長寬比。如果我希望圖片可以不管比例、直接被拉扁拉寬填滿容器，該怎麼設定？這篇記錄Flex3與Flex4各自的寫法，設定其實都只要一兩行。

## Flex3要設定哪些屬性？

Flex3裡要動兩個屬性：

\`\`\`actionscript
image.scaleContent = true;
image.maintainAspectRatio = false;
\`\`\`

設定了這兩項後就可以任意比例放縮圖片了。\`scaleContent = true\`讓圖片內容隨著元件大小縮放，而\`maintainAspectRatio = false\`則是放開長寬比的限制——兩個搭配起來，圖片就會被拉伸成元件的實際大小，不再維持原比例。

## Flex4的寫法有什麼不同？

到了Flex4，屬性被整併成一個\`scaleMode\`，只要設成\`stretch\`就好：

\`\`\`actionscript
scaleMode = "stretch";
\`\`\`

一行就達到和Flex3兩行設定的相同效果，讓圖片以不等比拉伸的方式填滿容器。

## 兩代設定方式速查表

| 版本 | 設定方式 | 效果 |
| --- | --- | --- |
| Flex3 | \`scaleContent = true\` + \`maintainAspectRatio = false\` | 圖片隨元件縮放，且不維持長寬比 |
| Flex4 | \`scaleMode = "stretch"\` | 圖片拉伸填滿容器，不維持長寬比 |

從Flex3升級到Flex4時，如果發現圖片縮放行為不如預期，先檢查是不是還在找舊的兩個屬性——改用\`scaleMode = "stretch"\`就能對應過去。

## 常見問題

### 為什麼我的Flex3圖片縮放後還是維持原比例？

因為\`maintainAspectRatio\`預設是\`true\`。要不等比縮放，必須同時設定\`scaleContent = true\`和\`maintainAspectRatio = false\`，只設其中一個不會生效。

### Flex4找不到maintainAspectRatio屬性怎麼辦？

Flex4把相關行為整併進\`scaleMode\`屬性，把它設成\`"stretch"\`就等同於Flex3的不等比拉伸，不需要再找舊屬性。

### 不等比縮放會造成什麼副作用？

圖片會被水平或垂直拉伸而變形，適合底圖、色塊類素材；若是人物、圖示等需要保持形狀的內容，建議還是維持等比縮放。

## 延伸閱讀

- [Flex 圖片不等比縮放設定：Flex3 與 Flex4 的正確寫法](/post/flex-image-non-uniform-scaling)：同樣聚焦 Flex3、Flex4，可接著比較不同情境的做法。
- [Flex 元數據標籤——告訴編譯器如何編譯](/post/flex-metadata-tags)：同樣聚焦 Flex3、Flex4，可接著比較不同情境的做法。
- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 ActionScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-11-29，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};