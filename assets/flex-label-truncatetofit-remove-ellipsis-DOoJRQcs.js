var e=`---
title: "Flex Label 為什麼結尾出現「…」？用 truncateToFit 解決"
description: "Flex 的 mx:Label 文字太長時結尾會自動出現「…」並截斷內容，只要把 truncateToFit 設為 false 即可關閉自動截斷，讓 Label 完整顯示文字而不需要靠 Tooltip 才看得到全文。"
date: 2011-07-22
category: 前端開發
tags: [Flex, ActionScript, UI元件, Troubleshooting]
readingTime: 1 分鐘
image: /images/tech/hero_flex-label-truncatetofit-remove-ellipsis.webp
imageAlt: 螢幕上顯示的程式碼特寫，象徵 Label 文字內容的顯示設定
---


# Flex Label 為什麼結尾出現「…」？用 truncateToFit 解決

使用 Flex 的 \`mx:Label\` 時，文字一長結尾常常莫名其妙出現「…」，必須把滑鼠移過去才能以 Tooltip 方式看到完整內容。這其實是 Label 的自動截斷（truncateToFit）行為，把它設為 \`false\` 就可以關閉。

## 為什麼 Label 結尾會出現「…」？

\`mx:Label\` 預設開啟 \`truncateToFit\` 功能：當文字寬度超過元件寬度時，會自動把多餘的部分截掉並在結尾補上「…」，完整內容則改用 Tooltip（滑鼠移過去才顯示）。這個設計在大多數情境很方便，但如果你希望文字一律完整顯示，這個預設行為反而會造成困擾。

## 怎麼關閉自動截斷？

這時要使用 \`truncateToFit="false"\` 去關閉自動截斷的功能：

\`\`\`xml
<mx:Label truncateToFit="false" id="lblSawFlopTotal" text="{status.average_loss}"/>
\`\`\`

加上這個屬性後，即使文字超過 Label 寬度，也不會再被截斷成「…」，內容會直接完整呈現。

## 常見問題

### 為什麼我的 Label 文字會變成「…」？

因為 \`mx:Label\` 的 \`truncateToFit\` 預設為 \`true\`，當文字超過元件寬度時會自動截斷並補上刪節號，完整內容要靠滑鼠移過去的 Tooltip 才看得到。

### 要怎麼讓 Label 完整顯示文字？

在 Label 上加上 \`truncateToFit="false"\`，關閉自動截斷功能，文字就不會再被截成「…」。

### truncateToFit 設成 false 會有副作用嗎？

超過寬度的文字會直接溢出顯示範圍，不會自動換行或縮排。如果畫面空間有限，建議改用 \`mx:Text\`（可自動換行）或自行調整版面寬度。

## 延伸閱讀

- [Flex Label 文字被截斷成「...」怎麼辦？用 truncateToFit=false 關閉自動截斷](/post/flex-label-truncatetofit)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [Flex 3 原生 TabNavigator 分頁太多怎麼辦？SuperTabNavigator 解法整理](/post/flex-supertabnavigator-scrollable-tabs)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。
- [把 Flex SDK 4 整合進 Flex Builder 3](/post/integrate-flex-sdk-4-into-flex-builder-3)：同樣聚焦 Flex、ActionScript，可接著比較不同情境的做法。

## 最後更新

2026-08-28（原文發布於 2011-07-22，本文保留原始筆記內容並補上 GEO 結構。）
`;export{e as default};