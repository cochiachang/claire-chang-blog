var e=`---
title: Flex Label 文字被截斷成「...」怎麼辦？用 truncateToFit=false 關閉自動截斷
description: Flex 的 mx:Label 文字太長時結尾常自動變成「...」，只能靠滑鼠移過去的 tip 才能看到完整內容。本文說明如何用 truncateToFit="false" 屬性關閉 Label 的自動截斷，讓完整文字直接顯示。
date: 2011-07-22
category: 前端開發
tags: [Flex, ActionScript, UI元件, 前端開發]
readingTime: 1 分鐘
image: /images/tech/hero_flex-metadata-tags.webp
imageAlt: Flex 開發主題的抽象程式碼背景圖
---


# Flex Label 文字被截斷成「...」怎麼辦？用 truncateToFit=false 關閉自動截斷

使用 Flex 的 \`mx:Label\` 時，文字太長常常結尾莫名其妙出現「...」，必須把滑鼠移過去才看得到 tip 顯示的完整內容。這篇文章說明如何用 \`truncateToFit="false"\` 一個屬性關閉這個自動截斷行為，讓 Label 完整顯示文字。

## 為什麼 Label 結尾會出現「...」？

\`mx:Label\` 預設開啟 \`truncateToFit\` 行為：當元件寬度不足以容納完整文字時，它會自動把超出部分截掉，並在結尾補上省略號「...」。此時使用者只能把滑鼠移到 Label 上，靠 tooltip（\`toolTip\`）才能看到完整內容。

這在多數表格、清單場景是合理的預設，但如果我希望文字一律完整顯示（例如自己已經控制了寬度或排版），這個截斷反而造成困擾。

## 怎麼關閉自動截斷？

只要把 \`truncateToFit\` 設為 \`false\`，Label 就不會再自動縮排截字，完整文字會直接顯示出來：

\`\`\`xml
<mx:Label truncateToFit="false" id="lblSawFlopTotal" text="{status.average_loss}"/>
\`\`\`

| 屬性 | 預設值 | 效果 |
| --- | --- | --- |
| \`truncateToFit="true"\`（預設） | true | 寬度不足時截斷文字並顯示「...」，滑鼠移過去可看 tip |
| \`truncateToFit="false"\` | — | 不截斷，完整顯示文字 |

## 使用時的取捨

- 關閉截斷後，過長文字可能溢出或被容器裁切，要注意版面是否容得下完整內容。
- 若仍需要讓使用者看到全部文字，可以搭配 \`maxDisplayedLines\`、\`toolTip\` 或改用 \`mx:Text\`（會自動換行）處理。
- 這個屬性適用於 \`mx:Label\`；Spark 的 \`s:Label\` 行為不同（需用 \`maxDisplayedLines\` 控制），遷移到 Flex 4 時要留意。

## 常見問題

### 為什麼 Flex Label 文字結尾會出現「...」？

因為 \`mx:Label\` 預設的 \`truncateToFit\` 行為會在寬度不足時自動截斷文字並加上省略號。把滑鼠移過去可透過 tip 看到完整內容，但畫面上只看得到「...」。

### 如何讓 Label 完整顯示文字不截斷？

在 \`mx:Label\` 上加上 \`truncateToFit="false"\` 即可關閉自動截斷，例如 \`<mx:Label truncateToFit="false" text="{data}"/>\`。要注意關閉後過長文字可能溢出版面。

### Flex 4 的 Spark Label 也適用 truncateToFit 嗎？

不適用。\`s:Label\` 沒有 \`truncateToFit\` 屬性，改用 \`maxDisplayedLines\` 控制截斷行為（設為 0 表示不截斷）。從 mx 遷移到 Spark 時要調整對應寫法。

## 參考資料
- [Adobe Flex 官方文件：LabeltruncateToFit](https://help.adobe.com/en_US/FlashPlatform/reference/actionscript/3/mx/controls/Label.html)

## 延伸閱讀

- [Flex Label 為什麼結尾出現「…」？用 truncateToFit 解決](/post/flex-label-truncatetofit-remove-ellipsis)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex 3 原生 TabNavigator 分頁太多怎麼辦？SuperTabNavigator 解法整理](/post/flex-supertabnavigator-scrollable-tabs)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-07-22，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};